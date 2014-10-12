FaceMaker
=========

Web based watchface designer for Facer (Android Wear)

There are some issues with this still, but we seem to be outputting faces fully compatible
with the latest version of Facer. You can add and remove layers, and modify most aspects of
a layer. The "Test Options" are currently non-functional however.

TODO (Rendering)
================

* [X] Implement all the Tags (Variables)
* [X] Go through and write a proper parser for variables instead of parseInt and breakage
* [X] Rotation for shapes
* [X] Rotation for images
* [X] Math for tags
* [X] Conditional Support
* [X] Font support
* [ ] Add Images
* [ ] Add Fonts
* [ ] Figure out how description.build effects things 

Fonts
=====

Are rendered by placing the base64 in a font tag in css, and using it as the family.

I can't figure out a better way of doing this, although it seems to work well

Editor
======

Image and shape editor still arent perfect, text is just about done. I'd like to add 
some sort of code assist for tags, math, and conditionals, but thats a ways off.

Tags are now handled a little better, through a static method on the FaceMaker class.
They have a description as well, for the help text. This will be used for the help
text. I'm not sure if that will be static or live as of yet.
