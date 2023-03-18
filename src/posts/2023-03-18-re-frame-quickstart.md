---
title: The missing re-frame quick start (with tutorial)
description: A quick guide to use Clojurescript re-frame
date: 2023-03-18
tags:
 - clojurescript 
 - re-frame
---

**Re-frame lacks a quick start guide, so this is my attempt to create one, including a TodoMVC tutorial.**

When I discovered **Clojurescript** and started to play around with it, the first library that I used was [Reagent](https://reagent-project.github.io/).  Essentially, it's a wrapper around React, allowing us to write components as Clojurescript functions and instead of JSX, using vectors and keywords[^helix] for the syntax. It has been pretty easy to start with, since I already known how React works and I was comfortable with the Clojure syntax. Like its parent library, it's basically offers a way to define reusable component, with internal state and props received from the parent components.

Since React and Reagent are UI libraries, the application state management is left to the programmer, and that's where something like [re-frame](http://day8.github.io/re-frame/re-frame/) comes handy. It implements a **model, view, update** paradigm using Reagent under the hood, and help separating the state management (model, update) from the UI components (view).  The library is similar to Redux having a **single central store** for state and **unidirectional data flow**.

The problem I found with re-frame, although it's actually a simple library, is that the **documentation doesn't provide a quick start page** like Reagent. Instead, it only offers a long, detailed explanation (which is still a recommended reading for fully comprehend how to architecture large apps). If you're already familiar with similar paradigms, a quick guide would be enough to get started with it.

```clojure
;; Importing the library
(:require [re-frame.core :as rf])

```

## App-db

The entire **application state** is saved inside a Reagent version of a single Clojure [atom](https://clojure.org/reference/atoms) called `app-db`. It's just a `map`, initially empty, similar to the following one.

```clojure
(def app-db ; will be called db from now on 
  {})
```

Re-frame stores the app state in a single source of truth, which, like all Clojure data structures, is immutable and updated using pure functions. This pattern makes state management flow simple to understand, ensures changes in state are **predictable**, and makes *debugging* easier.

This is a great explanation on how `app-db` works, directly from the re-frame README: 

> at any one time, the value in app-db is the result of performing a reduce over the entire collection of events dispatched in the app up until that time. The combining function for this reduce is the set of registered event handlers.

Re-frame progress in time applying the event handler functions to the previous state of the app. This means that the collection of events is **replay-able** from the beginning of time, step by step; a dream for debugging an app. To achieve this, it's important that all the event handlers are pure functions (without side-effects).

## Dispatch

To modify the user name value inside the *app state*, one needs to **dispatch** a new event. So, simply call the dispatch function with a vector containing the event name `:user/update-name` and the new value for the user name.

```clojure
(rf/dispatch [:user/update-name new-user-name])
```

The dispatch function sends the event in the re-frame event-loop for async processing. It can be used from anywhere in the application, so in this case it would most likely happen in a reaction to a click event on a "Save" button.

## Events

Now, it's necessary to define a new re-frame **event handler** using `reg-event-db` which updates the user name inside the app db. The event handler function receives the current state (db) and the triggering event as arguments. The event is a vector containing the event name (as a keyword) and the parameters.

```clojure
(rf/reg-event-db
  :user/update-name
  (fn [db [event-kw new-user-name]]
    (assoc-in db [:user :name] new-user-name)))
```

Now our `app-db` will look like the following:

```clojure
{:user {:name "admin"}}
```

An event handler should be a **pure function** which returns a new version of the db, only based on its *input parameters* and the *previous state* of the app. Again, it should be free from *side-effects*. A function is considered _pure_ if a given input maps to the same output all the time.

## Subscriptions

To show the user name inside a component, create a re-frame subscription called `:user/name` that extract the value of `:name` relative to the current `:user` in the state. 

```clojure
(rf/reg-sub
  :user/name
  (fn [db query-v]
    (get-in db [:user :name]])))
```

The handler function receives the app-db and `query-v` as parameters. `query-v` is the vector supplied to the subscription. In this case above, it's quite simple, and it's not using it. It's just doing an **extraction** of a value from the state.

The new subscription can be connected to a Reagent component using `subscribe`, which accepts a vector where the first element is the name of the subscription, and the rest other possible parameters.

```clojure
(defn user-name []
  ;; Returns an atom that needs to be dereferenced
  (let [username @(rf/subscribe [:user/name])]
    [:h1 username]))
```

Now every time the value of `[:user :name]` changes in the db, the related subscription function will re-run, and the new value will be **propagated** to the views depending on them, **updating** the Reagent component. We don't have to care about state management if the component mount/refresh because it's **all delegated to re-frame**. No more large props cascade, no context/provider pattern. A single map contains the entire app state that refreshes the view when gets updated.

Re-frame is implementing a pattern called **unidirectional data flow**,  where the application state can only be modified with dispatched actions. These actions trigger event handler functions that update the state. Than, the changes propagate consistently throughout the application. There is only one way to update the view. As a result, our view is a deterministic function of the data, making the data flow more predictable.

Subscriptions are not only used as extractors but they can also **compute derived data** from other subscriptions. For example, the user name can be returned in _uppercase_ or _lowercase_.

```clojure
(rf/reg-sub
  :user/name-uppercase
  ;; signals function
  (fn [query-v]
    (rf/subscribe [:user/name]))
  ;; computation function
  (fn [username query-v]
    (string/upper-case username)))
    
(rf/reg-sub
  :user/name-lowercase
  (fn [query-v]
    (rf/subscribe [:user/name]))
  (fn [username query-v]
    (string/lower-case username)))
```

In this case our subscription recevies two functions:

- A `signals` function that returns one or more subscriptions. It can return either a single signal, a vector of signals, or a map where the values are the signals.
    
- A `computation` function that takes the input values provided by the `signals` function, supplied as the first argument, and produces a new derived value, which will be the output of the node.

Another subscription that receives a parameter can be created easily.

```clojure
(rf/reg-sub
  :user/name-prefix-case
  (fn [[_ prefix str-case]]
    (case str-case     ; don't get confused
      :upper (rf/subscribe [:user/name-uppercase])
      :lower (rf/subscribe [:user/name-lowercase])
      (rf/subscribe [:user/name])))
  (fn [username [_ prefix str-case]]
    (str prefix ": " username)))
```

And it would be invoked as:

```clojure
(rf/subscribe [:user/name-prefix-case "Username" :lower])
```

## Co-Effects

In case something else is required, other than update the *state*, such as storing data asynchronously, the event handler need to cause side effects. To do this the previous handler defined with `reg-event-db` must be replaced with `reg-event-fx`. When to use one or the other? `reg-event-db` when only updating the state, `reg-event-fx` when side effects are needed (mostly defined with `:fx`); The latter can be seen as a wrapper of the former. Why using a separate function for side-effects? Because our event handler functions have to be pure, to keep the ability to have the state update history as a sequence of changes over time.

In the following code, we replaced the event handler to return a map with `:db` as the new app state and `:fx` a vector telling re-frame to dispatch asynchronously another event `:user/save-asynch` that would save the new user name somewhere like in the database with a server call.

```clojure
(rf/reg-event-fx
  :user/update-name
  (fn [{db :db} [_ new-user-name_]] ; 1st arg is coeffects, which contains the db
    {:db (assoc-in db [:user :name] new-user-name)
     :fx [[:dispatch [:user/save-asynch]]]}))
```

`:dispatch` is a built-in **effect** used to dispatch a single event. One can even create new custom effects, that are performing side-effects, after the app state ad been updated. This one will show an annoying alert to the user.

```clojure
(rf/reg-fx
  :alert
  (fn [s] (js/alert s))
```

To use it, modify the map returned before:

```clojure
{:db (assoc-in db [:user :name] new-user-name)
 :fx [[:dispatch [:user/save-asynch]]
      (when (> (count new-user-name) 10)
        [:alert "What a long name!"])]
```

## TodoMVC tutorial

For the one of you, like me, who prefer learning with a **practical examples**, here's a working example of TodoMVC created with *Reagent* and *re-frame*.

First I initialized the `app-db` state with empty values using a new event handler called `:initialize-db`, which returns a new `:db` set the initial *state* of the app.

```clojure
(rf/reg-event-fx
 :initialize-db
 (fn [_ _]
   {:db {:todo {:items {} :filter :all}}}))
```

In the app initialization, I dispatched the event **synchronously** to set the initial state, blocking the event loop. This call must run only once during app loading. 

```clojure
(rf/dispatch-sync [:initialize-db])
```

I access both the items and the filter with two subscriptions that simply extract the values.

```clojure
(rf/reg-sub
 :todo/items
 (fn [db _]
   (get-in db [:todo :items])))

(rf/reg-sub
 :todo/filter
 (fn [db _]
   (get-in db [:todo :filter])))
```

An `item` is a map composed as `{:id uuid :content text :active true}`, while the `filter` is a keyword that accepts `[:active :completed :all]` as value. 

When the user presses _Enter_ on the todo input, the Reagent component adds a item to the collection using the following event handler. It accepts a non-empty string as a parameter.

```clojure
(rf/reg-event-db
 :todo/add-item
 (fn [db [_ text]]
   (let [id (js/crypto.randomUUID)]
     (if (not (string/blank? text))
       (assoc-in db [:todo :items id] 
                 {:id id :content text :active true})
       db))))
       
;; Usage 
;; (rf/dispatch [:todo/add-item "write a re-frame tutorial"])
```

I defined other simple actions for todo items.

```clojure
(rf/reg-event-db
 :todo/remove-item
 (fn [db [_ id]]
   (update-in db [:todo :items] dissoc id)))

(rf/reg-event-db
 :todo/toggle-item
 (fn [db [_ id]]
   (update-in db [:todo :items id :active] not)))

(rf/reg-event-db
  :todo/set-item-content
  (fn [db [_ id text]]
    (assoc-in db [:todo :items id :content] text)))
```

I defined a similar action for setting the filter content (without performing a value check).

```clojure
(rf/reg-event-db
 :todo/set-filter
 (fn [db [_ filter-value]]
   (assoc-in db [:todo :filter] filter-value)))
   
;; Usage 
;; (rf/dispatch [:todo/set-filter :completed])
```

At this point, I'm able to add/remove/toggle items, update the content, and set a new filter. The next step is defining a new subscription that returns a filtered list of items. When the user clicks one of the filters in the UI, the list of items will be automatically filtered.

```clojure
(rf/reg-sub
 :todo/visible-items
 :<- [:todo/items] ; syntactic sugar for the signal function
 :<- [:todo/filter] 
 (fn [[items todo-filter] _]
   (when (and (map? items) (keyword? todo-filter))
    (let [filter-fn (case todo-filter
                      :active    :active
                      :completed (complement :active)
                      :all       identity)]
      (filter filter-fn (vals items))))))
```

Another computed subscription is the count of active items left.

```clojure
(rf/reg-sub
 :todo/active-items-count
 :<- [:todo/items]
 (fn [items _]
   (-> (filter :active (vals items))
       (count))))
```

What's left to complete the TodoMVC features are two actions: clearing the completed items and toggling all of them. We need two new event handlers to work on the list of items, either removing the ones that are completed or changing the state of all of them.

```clojure
(rf/reg-event-db
 :todo/clear-completed
 (fn [db _]
   (let [items         (get-in db [:todo :items])
         ;; Extract active items ids and remove them from the items map
         cleaned-items (->> (vals items)
                            (filter (complement :active))
                            (map :id)
                            (reduce dissoc items))]
     (assoc-in db [:todo :items] cleaned-items))))

(rf/reg-event-db
  :todo/toggle-all
  (fn [db _]
    (let [items         (get-in db [:todo :items])
          ;; Is there any active item?
          active        (not-every? (complement :active) (vals items))
          ;; Set toggles as completed or not, updating the items object
          updated-items (reduce (fn [acc id]
                                  (assoc-in acc [id :active] (not active)))
                                items
                                (keys items))]
      (assoc-in db [:todo :items] updated-items))))
```

You can explore the entire source code in `app.cljs` after opening the sandbox.

<iframe src="https://codesandbox.io/embed/reagent-re-frame-todomvc-z5d3cw?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="reagent+re-frame TodoMVC"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## Extra - Debugging re-frame

As React provide it's own Developer Tools with a Chrome extension, re-frame offers some integrated dashboards as libraries like [re-frame-10x](https://github.com/day8/re-frame-10x) or [re-frisk](https://github.com/flexsurfer/re-frisk) that are capable to provide a UI to explore the application state, show the events history and even navigate back in time reversing the app state to previous versions. Not bad!

![re-frame-10x](/assets/img/re-frame-10x.png "re-frame-10x dashboard")


[^helix]: An alternative library which supports the modern way to write React functional components is called [Helix](https://github.com/lilactown/helix).
