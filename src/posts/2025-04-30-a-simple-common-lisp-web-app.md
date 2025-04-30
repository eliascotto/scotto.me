---
title: A simple Common Lisp web app
description: A simple Common Lisp web app
date: 2025-04-30
tags:
 - 
---

One of the drawbacks of dealing with Common Lisp is the lack of documentation available. Too often, I find published libraries without an explanation of how to use them or only partially documented, and I need to dig into the source code to understand how they work or if that method is present or not. Although reading source code is a proven technique to improve one's grasp of a programming language, most other languages come with extensively documented libraries, which are appreciated by beginners and contribute to their popularity.

This lack of great documentation is one of the main reasons Common Lisp is considered a difficult language, resulting in it being less popular than it deserves.[^1]

![](/assets/img/lisp.jpg "[https://xkcd.com/224/](https://xkcd.com/224)")

Whether it's due to a lack of time or because Common Lisp code is not too difficult to read, _Lispers_ don’t particularly like publishing code with examples and tutorials for beginners. Some time ago, when I looked for guidance on writing a web app, I was surprised by the absence of a quickstart page to help me set up a simple server — something the Python community has provided for [Flask](https://flask.palletsprojects.com/en/stable/quickstart/) for many years.

>“The most underrated skill to learn as an engineer is how to document. Fuck, someone please teach me how to write good documentation. Seriously, if there's any recommendations, I'd seriously pay for a course (like probably a lot of money, maybe 1k for a course if it guaranteed that I could write good docs.)”
> [A drunk dev on reddit](https://www.reddit.com/r/ExperiencedDevs/comments/nmodyl/drunk_post_things_ive_learned_as_a_sr_engineer/)

So I will write a simple tutorial to create the first web app. The goal is to write a guestbook demo, involving templates *rendering*, connecting to a database to run queries, and exposing routes to the webpage.

The requirements are: having a Common Lisp implementation, like SBCL, with Quicklisp, the dependencies manager. Also you’ll need a REPL integrated into your IDE, like SLY for Emacs or Alive for VSCode. For this tutorial, I’ll use some of the modern libraries that provide an interface similar to other modern languages, so it would be a bit easier to follow along.
## The server

First thing first, I created a new Common Lisp project. To do that with a simple boilerplate, I loaded `cl-project` in the environment, and called the function `make-project` with a path and a name for the project.

```lisp
> (ql:quickload :cl-project)
To load "cl-project":
  Load 1 ASDF system:
    cl-project
; Loading "cl-project"
..
(:CL-PROJECT)

> (cl-project:make-project #P"~/guestbook/" :name "guestbook")
writing ~/guestbook/guestbook.asd
writing ~/guestbook/README.org
writing ~/guestbook/README.markdown
writing ~/guestbook/.gitignore
writing ~/guestbook/src/main.lisp
writing ~/guestbook/tests/main.lisp
T
```

Then I run this command to let Quicklisp know where my new project is located.

```lisp
> (pushnew #P"~/guestbook/" asdf:*central-registry* :test #'equal)
```

Opening the project file `guestbook.asd`, I declared the required libraries into the `:depens-on` property so that Quicklisp would download them from the repo and load them into the environment.

```lisp
;; portion of guestbook.asd
:depends-on (;; Generic
			 :alexandria
			 :uiop
			 ;; Perl style Regex
			 :cl-ppcre
			 ;; To use @export annotation
			 :cl-syntax-annot
			 ;; Web app protocols libraries
			 :clack
			 :lack
			 ;; Web framework
			 :caveman2
			 ;; Template engine
			 :djula
			 ;; Database
			 :cl-dbi)
```

Now, inside `src/core.lisp` (I renamed the file from `main` to `core`) I added two new functions, to start and stop the server, which we will be helpful to use from the REPL.

```lisp
;; src/core.lisp
(defvar *server* nil)

(defparameter *app*
  (lack:builder
	  (:static
      :path (lambda (path)
              (if (ppcre:scan "^(?:/images/|/css/|/js/|/robot\\.txt$|/favicon\\.ico$)" path)
                  path
                  nil))
      :root *static-directory*)
  ;; Additional middlewares
    guestbook.web:*web*))

@export
(defun start (&rest args
              &key
                (server :hunchentoot)
                (port 3210)
                (debug nil)
              &allow-other-keys)
  "Starts the server."
  (unless (null *server*)
    (restart-case (error "Server is already running.")
      (restart-server ()
        :report "Restart the server"
        (stop))))

  (setf *server* (apply #'clack:clackup *app*
                   :server server
                   :port port
                   :debug debug
                   args))
  (format t "Server started"))

@export
(defun stop ()
  "Stops the server."
  (unless (null *server*)
    (clack:stop *server*)
    (format t "Server stopped")
    (setf *server* nil)))
```

`*server*` contains the server instance and is defined as a variable since we will need to redefine it. `*app*` is the web application wrapped with a layer by *Lack*. `start` and `stop` instantiate the server with some logging, or raise errors if the action is not successful.

*Lack* and *Clack* are the two libraries I used to wrap the web application. [The first one](https://github.com/fukamachi/lack) allows to define a series of middlewares in the server, for example I used `:static` to tell the server where to find all the static assets in the project, inside the directory pointed by `*static-directory*`. Other middlewares are available, like logging, managing sessions or providing authentication features, or you can create your own. [*Clack*](https://github.com/fukamachi/clack) instead is an abstraction layer for the server that provides some parameters to customise it, for example, to quickly swap which server to use between development mode (for example `hunchentoot`) and production (maybe `woo`).

```lisp
(unless (null *server*)
    (restart-case (error "Server is already running.")
      (restart-server ()
        :report "Restart the server."
        (stop))))
```

In this portion of the code, I defined a restart action for the debugger. The Common Lisp debugger always has `RETRY` and `ABORT` actions for every exception raised. By declaring a `restart-case`, we are signalling an error and adding custom choices to the one offered by default by the debugger. The new option I added is called `restart-server` and if selected, it first `(stop)` the server and then restart the operation, so the function would run again without raising an error. It’s a smart way to interact with the REPL and improve the developer experience using the language directly.

![](/assets/img/cl-restart-case-server.png)

More on conditions and restart [here](https://gigamonkeys.com/book/beyond-exception-handling-conditions-and-restarts) and [here](https://lispcookbook.github.io/cl-cookbook/error_handling.html).

At the top of `src/core.lisp` I set the package definition, and some initialisation function calls.

```lisp
;; portion of src/core.lisp
(in-package :cl-user)
(defpackage guestbook.core
  (:use :cl)
  (:import-from :guestbook.config
                :*static-directory*))
(in-package :guestbook.core)

(syntax:use-syntax :annot)
```

`(syntax:use-syntax :annot)`, from the package `cl-syntax-annot`, allows us to use some special decoration notation at the top of the function. At the top of `start` and `stop` I added an `@export` tag which tells the compiler that a function is exported by the package. 
## Configuration

I put the configuration parameters for the app into `src/config.lisp`, there are better ways but they’re not necessary for a project this simple.

```lisp
;; portion of src/config.lisp
@export
(defparameter *application-root* (asdf:system-source-directory :guestbook))
@export
(defparameter *static-directory* (merge-pathnames #P"static/" *application-root*))
@export
(defparameter *template-directory* (merge-pathnames #P"templates/" *application-root*))

@export
(defvar *config*
  '(:databases ((:maindb :sqlite3 :database-name "/Users/../guestbook/guestbook.sqlite"))
    :schema-file "db/schema.sql"))
```

The variable `*config*` needs a specific format to be used with `cl-dbi`, which is the library that I used to interface with the database. In a real application, it would be good to differentiate between *dev* or *prod* mode with different configuration used, for example to point to different databases, or to use a different server with *Clack*.
## Database

I created a new file into `db/schema.sql` and put the SQL code to create a message table.

```sql
-- db/schema.sql
CREATE TABLE message (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL,
    ts       DATETIME NOT NULL,
    content  TEXT NOT NULL
);
```

Then I run `sqlite3 guestbook.sqlite --init db/schema.sql` from the terminal to create and initialise a new database in the project root.

I declared the functions to access the database in a new file `src/db.lisp`.

```lisp
;; src/db.lisp
(in-package :cl-user)
(defpackage guestbook.db
  (:use :cl)
  (:import-from :guestbook.config
                :*config*
                :*application-root*))
(in-package :guestbook.db)

(syntax:use-syntax :annot)

(defun connection-settings (&optional (db :maindb))
  (cdr (assoc db (getf *config* :databases))))

@export
(defun db (&optional (db :maindb))
	"Returns a cached database connection for DB (defaults to :maindb). Uses `connection-settings` and `dbi:connect-cached`. 
	
	Usage: (db) or (db :testdb)"
  (apply #'dbi:connect-cached (connection-settings db)))

@export
(defvar *connection* nil)

@export
(defmacro with-connection (conn &body body)
  "Executes BODY with *CONNECTION* dynamically bound to CONN.
CONN should be a database connection object, typically from `db`.

Usage: (with-connection (db :maindb)
         (dbi:do-sql *connection* \"SELECT * FROM users\"))"
  `(let ((*connection* ,conn))
     (unless *connection*
       (error "Database connection cannot be NIL"))
     ,@body))
```

The first macro of the project. It’s a simple wrapper that provides a new variable `*connection*` to use inside the `body`. Raises an error if the `conn` value that we passed is not initialised. The function `db` instead returns a valid connection, cached automatically by the library.
## The Web App

Finally we can create the web application which I put inside `src/web.lisp`. It’s a bit longer then the other files so I will break it into chunks.

```lisp
;; portion of src/web.lisp
(in-package :cl-user)
(defpackage guestbook.web
  (:use :cl
        :caveman2
        :guestbook.db)
  (:import-from :guestbook.config
                :*template-directory*)
  (:export :*web*))
(in-package :guestbook.web)

(defclass <web> (<app>) ())
(defvar *web* (make-instance '<web>))
(clear-routing-rules *web*)
```

The web framework we are using is called *Caveman*, developed by [Eitaro Fukamachi](https://github.com/fukamachi), who is a very prolific *lisper* and the author of multiple libraries that I am using, including *Lack*, *Clack*, *cl-dbi*, all having great integration with each other. `<app>` is a *class* defined by the web framework and I am extending it and instantiating in `*web*`. `clear-routing-rules` is a function inherited from *Ningle*, another web framework, which clears the routes association inside the web app instance.
### Templates

Our web app needs to render some static templates with data, and to do that there’s a great library called `djula` which allows to use most of the same tags and filters that [django exposes](https://docs.djangoproject.com/en/5.1/ref/templates/builtins/) in its template engine.

I’m not going to include the templates source but you can have a look at them in the repository, inside `templates/` folder.

```lisp
;; portion of src/web.lisp
(djula:add-template-directory *template-directory*)

(defparameter *template-registry* (make-hash-table :test 'equal))

(defun render (template-path &optional env)
  "Renders a Djula template from TEMPLATE-PATH, caching it for reuse.
ENV is an optional plist of variables passed to the template."
  (let ((template (gethash template-path *template-registry*)))
    (unless template
      ;; If the template is not already compiled, it is compiled, and stored in *TEMPLATE-REGISTRY*.
      (setf template (djula:compile-template* (princ-to-string template-path)))
      (setf (gethash template-path *template-registry*) template))
    (apply #'djula:render-template*
           template nil
           env)))
```

The first function call, tells djula where to find the templates in the project. `render` is a function that receives a template path as a parameter and compiles the template for better performance. The first time the template is compiled, it gets stored in a hash table called `*template-registry*`, which will work as a cache the next time we are going to reuse the template. In a more complex application, I would add a way to invalidate the cache automatically if a template changes.
### Messages

I defined some functions to perform CRUD operations on the database. `decode-ts` converts unix timestamp into a readable date-time string.

```lisp
;; portion of src/web.lisp
(defun decode-ts (ts)
  "Converts a universal time value TS into a human-readable timestamp string,
formatted as 'YYYY-MM-DD HH:MM:SS'."
  (multiple-value-bind (sec min hour day month year)
    (decode-universal-time ts)
   (format nil "~4,'0D-~2,'0D-~2,'0D ~2,'0D:~2,'0D:~2,'0D" year month day hour min sec)))

(defun add-message (name message)
  (with-connection (db)
    (let ((sql "INSERT INTO message (username, ts, content) VALUES (?, ?, ?)")
          (ts (get-universal-time)))
     (dbi:do-sql *connection* sql (list name ts message)))))


(defun delete-message (id)
  (with-connection (db)
    (let ((sql "DELETE FROM message WHERE id = ?"))
      (dbi:do-sql *connection* sql (list id)))))


(defun get-all-messages ()
  (with-connection (db)
    (let* ((sql "SELECT * FROM message ORDER BY ts DESC")
           (messages (dbi:fetch-all
                      (dbi:execute
                       (dbi:prepare *connection* sql)))))
      ;; Transform unix timestamp into readable format
      (mapcar (lambda (row)
                (setf (getf row :|ts|) (decode-ts (getf row :|ts|)))
                row)
              messages))))
```
### Routes

To allow the users to perform CRUD operations, we need to expose a few routes to be called by the web frontend. There are two ways to define routes in Caveman but this one seems a bit more clear to me than using annotations. So `defroute` is a macro that receives the route path, some parameters like `:method` and eventually some arguments, and then defines the body to handle the request. Inside the body, we can access the request object via `*request*` and extract data from using for example the function `request-body-parameters`.

The routes are self-descriptive. `/` render `index.html` passing all the messages from the db, `/message` handles POST requests and insert the message in the database if the parameters conform, and the `/message/delete` deletes a message. 

```lisp
;; portion of src/web.lisp
(defroute "/" ()
  (render #P"index.html"
          (list :messages (get-all-messages))))


(defroute ("/message" :method :POST) ()
  (let* ((body-params (request-body-parameters *request*))
         (name-param (assoc "name" body-params :test #'string=))
         (message-param (assoc "message" body-params :test #'string=)))
    (if (and (consp name-param) (consp message-param))
      (add-message (cdr name-param)
                   (cdr message-param))
      (format t "Missing body parameters: received ~A~%" body-params)))
  (redirect "/"))


(defroute ("/message/delete" :method :POST) ()
  (let* ((body-params (request-body-parameters *request*))
         (id-param (assoc "id" body-params :test #'string=)))
    (if (consp id-param)
        (let ((id (ignore-errors (parse-integer (cdr id-param)))))
          (when id
            (delete-message id)))
        (format t "Missing id parameter.")))
  (redirect "/"))
```

I also added another function which defines a method on the web app class. `on-exception` is a generic function called when an exception occurs in the web application. This method is specific on the parameter type since it will run only if the exception has code 404 — not found — and in that case I return a specific custom template.

```lisp
;; portion of src/web.lisp
(defmethod on-exception ((app <web>) (code (eql 404)))
  (declare (ignore app code))
  (render #P"404.html"))
```
## Run the demo

Now I can load the project into the environment with Quicklisp.

```lisp
> (ql:quickload :guestbook)
To load "guestbook":
  Load 1 ASDF system:
    guestbook
; Loading "guestbook"
......................
(:GUESTBOOK)
CL-USER> 
```

Then I can start the server and point my browser page to `127.0.0.1:3210`.

```lisp
> (guestbook.core:start)
Hunchentoot server is started.
Listening on 127.0.0.1:3210.
Server started
```

![](/assets/img/guestbook.png)

I can send messages that get saved with a timestamp, and then delete them. Pretty simple.
## Reducing boilerplate

When comparing the line of code required in Common Lisp for a guestbook against the Python-flask version, the latter is quicker and simpler to write — 36 lines of Python vs. 229 of Lisp.

Lisp is known to be a powerful language. Its strength is its ability to model itself according to the problem the developer is solving. In this case, I am dealing with a simple guestbook demo, but to give a better taste of the language I will try to reduce the size of the program by hiding some code and configuration.

First let’s have a look at the new guestbook app, written in my new custom web framework called *flashcl*. 29 LOC properly formatted and stripped of all comments, and not too hard to read.

```lisp
;; src/core.lisp
(in-package :cl-user)
(defpackage guestbook.core
  (:use :cl :flashcl))
(in-package :guestbook.core)

(init-flashcl :sqlite3 "guestbook.sqlite")

(defmodel message
  ((username :col-type (:varchar 50) :accessor message-username)
   (content  :col-type  :text        :accessor message-content)))

(defroute "/" ()
  (render #P"index.html" (list :messages (db-all 'message))))

(defroute ("/message" :method :POST) ()
  (let ((name (form-param "name"))
        (message (form-param "message")))
    (if (and name message (> (length name) 0) (> (length message) 0))
      (db-add (make-instance 'message :username name :content message))
      (format t "Missing body parameters: received ~A~%" (body-params))))
  (redirect "/"))

(defroute ("/message/delete/:id" :method :POST) (&key id)
  (if id
    (let ((id (ignore-errors (parse-integer id))))
      (when id
        (db-delete (db-find 'message id)))
      (format t "Missing id parameter.")))
  (redirect "/"))
```

Where did `start` go? Is now part of the *flashcl* framework, so imported in the package. Here the usage reference.

```lisp
;; --- Run the Application ---
;; Call run-app function from your REPL or add it here to run on load.
;; Call stop-app to stop the server.
;;
;; Example: (guestook::run-app) or just (run-app) inside the package.
;; (run-app :port 5000 :server :hunchentoot)
```
Then I modified slightly the template delete button to point to the correct route with `id` parameter.

This is the code for *flashcl*, and as you can see is quite reusable for other web projects since you can define new database models and routes quickly with supports for static files and templates. I used *mito*, another library from [Eitaro Fukamachi](https://github.com/fukamachi/mito), which is a ORM that works well with SQLite.

First I imported the library and exported only whats needed by the user.

```lisp
(defpackage :flashcl
  (:use #:cl)
  (:import-from #:caveman2
                #:defroute
                #:redirect
                #:*request*
                #:*response*)
  (:import-from #:lack.request
                #:request-parameters)
  (:import-from #:mito
                #:dao-table-class ; Re-export metaclass for use in defmodel
                #:connect-toplevel
                #:ensure-table-exists
                #:select-dao
                #:find-dao
                #:delete-dao
                #:insert-dao)
  (:export ;; Setup
          #:init-flashcl
          ;; App Definition
          #:flashcl-app ;; Variable holding the app instance
          #:defmodel
          ;; Routing & Request/Response
          #:defroute
          #:form-param
          #:render ;; Re-export caveman's render (or wrap it)
          #:redirect ;; Re-export caveman's redirect
          ;; Database
          #:db-all
          #:db-add
          #:db-find
          #:db-delete
          #:dao-table-class ;; Re-export metaclass
          ;; Running
          #:run-app
          #:stop-app))
```
Then I wrote a initialisation function similar to Flask which setup various variable and create a new instance of the caveman webapp.

```lisp
(defun init-flashcl (db-type db-path &optional (template-dir "templates")
                                               (static-dir "static"))
  "Initializes Flashcl environment. Sets DB/Template paths, connects DB."
  (setf *database-path* (get-absolute-path db-path))
  (setf *static-directory* (get-absolute-path static-dir))

  ;; Set Djula's template directory
  (djula:add-template-directory (get-absolute-path template-dir))
  (format t "Set template directory as ~A~%" (get-absolute-path template-dir))

  ;; Connect to SQLite database
  (handler-case (connect-toplevel db-type :database-name *database-path*)
    (error (c)
      (format *error-output* "~&Error connecting to database ~A: ~A~%" *database-path* c)))

  ;; Define the Caveman2 app instance here
  (setf flashcl-app (make-instance 'caveman2:<app>)))
```
	To make it easy to define a new database model for the application, hiding the *mito* library, I created a macro that ensure the table gets created correctly. *mito* automatically adds a few fields to the table definition like `id` and `created_at` or `updated_at` so we don't have to worry about them.
	
```lisp
(defmacro defmodel (name slots &rest options)
  "Defines a Mito DAO class and ensures its table exists.
   Example: (flashcl:defmodel comment
              ((name :col-type (:varchar 20))
               (comment :col-type :text)))"
  (let ((class-options options)
        (table-name (intern (format nil "~aS" (string-downcase name)) *package*))) ; Basic pluralization
    
    ;; Add table name inference if not present
    (unless (find :table-name options :key #'car)
      (push `(:table-name ,(string-downcase table-name)) class-options))

    `(progn
      (defclass ,name ()
        ,slots
        (:metaclass mito:dao-table-class)
        ,@class-options)
      ;; Ensure table exists after class definition
      ;; Note: This runs at compile/load time when defmodel is processed.
      ;; Ensure DB is connected before loading code using defmodel.
      (handler-case (ensure-table-exists ',name)
        (error (c)
          (format *error-output* "~&Warning: Could not ensure table for ~A (DB might not be connected yet?): ~A~%" ',name c)))
      ;; Return the class name
      ',name)))
```
Then I added some database helpers to perform a few CRUD actions on the db.

```lisp
(defun db-all (class-name)
  "Selects all records for the given model class."
  (select-dao class-name))

(defun db-find (class-name id)
  "Finds a model instance by ID."
  (find-dao class-name :id id))

(defun db-add (instance)
  "Inserts a model instance into the database."
  (insert-dao instance))

(defun db-delete (instance)
  "Deletes a model instance from the database."
  (delete-dao instance))
```
## Conclusions

To recap, in this tutorial I used the latest libraries in Common Lisp to create a simple guestbook webapp. Then I wrote a simple reusable wrapper to make our code more concise, aiming to challenge the Flask framework in Python. You can find the full source code of the two versions [here](https://github.com/eliascotto/cl-guestbook) and [here](https://github.com/eliascotto/cl-guestbook-v2).

Ultimately I would give my opinion on using Common Lisp as a web server. Despite the fact that it can handle web requests well, with performant server libraries (hunchentooth and woo), I would say that there are better languages for developing modern web apps. 

Common Lisp shines when dealing with low-level tasks like [microcontroller programming](https://blog.funcall.org/lisp%20psychoacoustics/2024/05/01/worlds-loudest-lisp-program/) or performing [intensive computation](https://www.grammarly.com/blog/engineering/running-lisp-in-production/) at scale. When these complex systems need to communicate with the outside world, perhaps via an API, creating a server is the correct way. However, the advantages of using it to write ordinary backends for modern web applications are limited. REPL-driven programming is probably the only benefit since hot reloading has already been implemented in all high-level languages, but the iteration with the REPL is still mostly limited to Emacs, with SLIME and SLY, which are all examples of great software, but their usability doesn’t reflect that of other modern editors.

I would like to give a shout-out to [Alive](https://marketplace.visualstudio.com/items?itemName=rheller.alive) which is the only Common Lisp extension for VSCode that implements the REPL with features similar to what SLIME and SLY bring to Emacs. The extension is still under development and not yet a full replacement for Emacs, especially during debugging, but it has great features and a lot of potential thanks to the VSCode interface, which is web-based, compared to Emacs's buffers.

Feel free to email me if you have any questions and/or recommendations.

[^1]: Parenthesis are great.
