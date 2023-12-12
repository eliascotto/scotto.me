---
title: Common Lisp data structures
description: Common Lisp data structures
date: 2023-12-12
tags:
 - common-lisp
 - data-structures
---

Just some notes on the main data structures in Common Lisp. Each instruction can be evaluated in the REPL, the output here has been taken from SBCL.

As a general rule, keep in mind the following sentences:

- **Use the appropriate data structure for the situation.**

- **Favor iteration over recursion. Recursion is good for recursive data structures.**

## List
Lists are used when you need to store a *sequence* of elements. It supports different data types. They are particularly useful when you need to perform operations that involve recursion or iteration. 
```lisp
;; Declaration
cl-user> (defparameter *list* '(1 2 3 4))
*list*
cl-user> (list 1 2 3 4) ; alternative
(1 2 3 4)

;; Access
cl-user> (nth 3 *list*) ; not performant for long lists
4 (3 bits, #x4, #o4, #b100)
cl-user> (first *list*)
1 (1 bit, #x1, #o1, #b1)

;; Adding
cl-user> (push '0 *list*)
(0 1 2 3 4)

;; Deleting
cl-user> (setf *list* (remove 1 *list*))
(0 2 3 4)
```

## Association list - alist
Association lists are lists, implemented using cons cells, which are used to store key-value pairs where the key is a symbol. They are slower than hash-tables for large amount of data.
```lisp
;; Declaration
cl-user> (defparameter *alist* '((key1 . value1) (key2 . value2)))
*alist*

;; Access
cl-user> (cdr (assoc 'key1 *alist*))
value1

;; Adding
cl-user> (push '(key3 . value3) *alist*)
((key3 . value3) (key1 . value1) (key2 . value2))

;; Deleting
cl-user> (setf *alist* (remove 'key1 *alist* :key #'car))
((key3 . value3) (key2 . value2))
```

## Property list - plist
Property are used when you need to store key-value pairs and the keys are symbols. They are simpler than hash tables and association lists but can be slower for large amounts of data.
```lisp
;; Declaration
cl-user> (defparameter *plist* '(:key1 value1 :key2 value2))
*plist*

;; Access
cl-user> (getf *plist* :key1)
value1

;; Adding
cl-user> (setf (getf *plist* :new-key) 'new-value)
new-value

;; Deleting
cl-user> (remf *plist* :key1)
t
cl-user> *plist*
(:new-key new-value :key2 value2)
```

## Hash table
Hash tables are data structures that store key-value pairs and provide efficient lookup and storage. They are highly efficient for large datasets. They can be ordered and used as stack.
```lisp
;; Declaration
cl-user> (defparameter *hash-table* (make-hash-table))
*hash-table*

;; Adding
cl-user> (setf (gethash 'key1 *hash-table*) 'value1)
value1

;; Access
cl-user> (gethash 'key1 *hash-table*)
value1

;; Deleting
cl-user> (remhash 'key1 *hash-table*)
t
```

## Array
Arrays are multidimensional data structures that hold elements accessible by indices. They offer efficient storage and access for structured data.
Arrays are faster than lists for random access, but slower for operations that involve adding or removing elements.
```lisp
;; Declaration
cl-user> (defparameter *array* #(1 2 3 4))
*array*

;; Access
cl-user> (aref *array* 2)
3

;; Modifying
cl-user> (setf (aref *array* 1) 5)
5

;; Deleting
;; To delete elements, consider creating a new array without the unwanted elements.
```


## Vector
A vector is a one-dimensional array. Vectors are similar to arrays but can dynamically grow and shrink.

```lisp
;; Declaration
cl-user> (defparameter *vector* #(1 2 3 4))
*vector*

;; Access
cl-user> (elt *vector* 0)
1

;; Modifying
cl-user> (setf (elt *vector* 3) 5)
5

;; Deleting
;; To delete elements, consider creating a new vector without the unwanted elements.
```

## Structure
Structures are user-defined data structures created using `defstruct`, allowing the grouping of different data types together.
```lisp
;; Declaration
cl-user> (defstruct person name age)
person

;; Creating
cl-user> (make-person :name 'Alice :age 30)
#S(PERSON :NAME ALICE :AGE 30)

;; Access
cl-user> (person-name (make-person :name 'Bob :age 25))
Bob

;; Modifying
cl-user> (setf (person-age *person*) 40)
40

;; Deleting
cl-user> (makunbound '*person*)
```

## References

https://github.com/foxsae/The-One-True-Lisp-Style-Guide
