---
title: Common Lisp data structures
description: Common Lisp data structures
date: 2023-07-04
tags:
 - common-lisp
 - data-structures
---

Just some notes on the main data structures in Common Lisp. Each instruction can be evaluated in the REPL, the output here has been taken from SBCL.

As a general rule, keep in mind the following.

**Use the appropriate data structure for the situation.**

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

## Array 
An array is a collection of elements that are identified by a set of integer indices, one for each dimension of the array. They are used when you need to store a sequence of elements that are all of the same type and you need to access them by their indices. Arrays are faster than lists for random access, but slower for operations that involve adding or removing elements.
```lisp

```

## Vector
A vector is a one-dimensional array. It is a sequence of elements that are stored in a contiguous block of memory. Vectors are used when youneed to store a sequence of elements that are all of the same type and you need to access them by their index. They are faster than lists for random access, but slower for operations that involve adding or removing elements at the beginning.

## References

https://github.com/foxsae/The-One-True-Lisp-Style-Guide
