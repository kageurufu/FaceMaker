FaceMaker
=========

Web based watchface designer for Facer (Android Wear)

There are some issues with this still, but we seem to be outputting faces fully compatible
with the latest version of Facer. You can add and remove layers, and modify most aspects of
a layer. The "Test Options" are currently non-functional however.

TODO (Rendering)
================

* [ ] Implement all the Tags (Variables)
* [X] Go through and write a proper parser for variables instead of parseInt and breakage
* [ ] Rotation for shapes
* [ ] Rotation for images
* [X] Math for tags
* [X] Conditional Support
* [X] Font support
* [ ] Add Images
* [ ] Add Fonts
* [ ] Figure out how description.build effects things

Thoughts
========

Theres some major disconnects between some old faces and newer ones. It seems like
the "build" key in description.json is highly relevant. Faces without this seem to
have the wrong image alignment. I need to either

1. Find an old copy of facer and play with the editor
2. Add a warning that old faces may not play nicely, but when fixed they will be updated

Fonts
=====

Are rendered by placing the base64 in a font tag in css, and using it as the family.

I can't figure out a better way of doing this, although it seems to work well

Editor
======

Image and shape editor still arent perfect, text is just about done. I'd like to add 
some sort of code assist for tags, math, and conditionals, but thats a ways off.

I'd also like to write the tags in some better way, so the Ractive editor could be 
responsible for rendering the help at the bottom, and make it easier to add more in 
the future. I also need to play with Facer and see if things like conditional results 
can be used in math, or vice-versa, or if Facer only applies it's parsing in a single
iteration.
