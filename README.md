FaceMaker
=========

Web based watchface designer for Facer (Android Wear)

At the moment, its really just a static renderer for faces though

The variables, once I finish implementing all of them should update though

TODO (Rendering)
================

* [ ] Implement all the Tags (Variables)
* [ ] Go through and write a proper parser for variables instead of parseInt and breakage
* [ ] Rotation for shapes
* [ ] Rotation for images
* [ ] Math for tags
* [ ] Conditional Support
* [ ] Font support

Thoughts
========

Instead of trying to properly tokenize and split up the Tags and Conditionals,
I could recursively search for groups of $something$ for conditionals, using
String.replace(regexp, func(match, p...))

That could work, I need to experiment.

Fonts
=====

Perhaps these could be loaded into css using Base64, I'll have to experiment
I could just define each font as its own font-family (filename.replace(/\s/g, "_"))
and use them that way. I've never ajax loaded fonts before

Editor
######

This is waiting until the rendering is (mostly) working. I might start on it sooner
though
