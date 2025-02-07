---
title: Common Lisp data structures
description: Common Lisp data structures
date: 2023-12-12
tags:
 - common-lisp
 - data-structures
---

Quick reference for the main data structures in Common Lisp. Each instruction can be evaluated in the REPL, using *SBCL*.

Some general rules good to follow are:

- **Use the appropriate data structure for the situation.**
- **Favor iteration over recursion. Recursion is good for recursive data structures.**

## List
Lists are used when you need to store a *sequence* of elements. It supports different data types. They are particularly useful when you need to perform operations that involve recursion or iteration. 

**Key points**: ordered, flexible size, efficient for traversal, slow for random access

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

**Key points**: key-value pairs, simple structure, inefficient for large datasets

```lisp
;; Declaration
cl-user> (defparameter *alist* '((:a . 1) (:b . 2)))
*alist*

;; Access
cl-user> (assoc :a *alist*)
(A . 1)
cl-user> (cdr (assoc :a *alist*))
1

;; Adding
cl-user> (push '(:c . 3) *alist*)
((C . 3) (A . 1) (B . 2))

;; Deleting
cl-user> (setf *alist* (remove :c *alist* :key #'car))
((A . 1) (B . 2))
```

## Property list - plist
Property are used when you need to store key-value pairs and the keys are symbols. They are simpler than hash tables and association lists but can be slower for large amounts of data.

**Key points**: key-value pairs, lightweight, inefficient for large datasets

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
Hash tables store key-value pairs and provide efficient lookup and storage. They are highly efficient for large datasets.

**Key points**: key-value pairs, fast lookups, mutable

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
Arrays are multidimensional data structures that hold elements accessible by indices. Arrays are faster than lists for random access, but slower for operations that involve adding or removing elements. Arrays have a fixed size upon creation, but they can be resized using `adjust-array`.

**Key points**: multidimensional, fixed size, efficient access by index

```lisp
;; Declaration
cl-user> (defparameter *array* (make-array 4 :initial-contents '(1 2 3 4)))
*array*

;; Access
cl-user> (aref *array* 2)
3

;; Modifying
cl-user> (setf (aref *array* 1) 5)
5

;; Extending/Shrinking
cl-user> (setf *array* (adjust-array *array* 6 :initial-element 0))
#(1 5 3 4 0 0)

;; Deleting
;; To delete elements, consider creating a new array without the unwanted elements.
```


## Vector
A vector is a one-dimensional array. Vectors are similar to arrays but can dynamically grow and shrink using functions like `vector-push` and `vector-pop`. Vectors are particularly useful when you need a sequence that can change size dynamically.

**Key points**: one-dimensional, dynamic size, efficient access by index

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

;; Adding elements
cl-user> (vector-push-extend 6 *vector*)
4
cl-user> *vector*
#(1 2 3 5 6)

;; Removing elements
cl-user> (vector-pop *vector*)
6
cl-user> *vector*
#(1 2 3 5)

;; Converting to a list
cl-user> (coerce *vector* 'list)
(1 2 3 5)

;; Shrinking/Extending
cl-user> (setf (fill-pointer *vector*) 2)
2
cl-user> *vector*
#(1 2)

;; Push extending
cl-user> (vector-push-extend 7 *vector*)
2
cl-user> *vector*
#(1 2 7)
```

## Structure
Structures are user-defined data structures created using `defstruct`, allowing the grouping of different data types together.

**Key points**: user-defined, structured, efficient access

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

- https://github.com/foxsae/The-One-True-Lisp-Style-Guide
- https://lispcookbook.github.io/cl-cookbook/data-structures.html#sequences
