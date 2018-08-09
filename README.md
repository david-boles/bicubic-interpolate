# bicubic-interpolate
A javascript library for interpolating 2D scalar fields/ 3D surfaces.

# Currently under development...

# Advantages
- ## Arbitrary interpolated points
  Interpolate whatever point you want, the library doesn't just add points with regular spacings.
- ## Caching
  The coefficients are cached, making significant numbers of calls to the interpolator more efficient.
- ## Easy tiling
  A function for automatically creating and caching a grid of individual bicubic interpolators, estimating data points outside the provided region (allowing the interpolation to work to the edge of your data and beyond, if poorly), as well as scaling and translating between your coordinate space and that of the interpolators.
- ## Interpolate an arbitrary number of surfaces
  Easily interpolate multiple scalar fields in the same region (e.g. RGB components of an image).
- ## Adopter of the Contributor Covenant
  This is my first open source project/ library that I'm really intending to be maintained and usable by the community. Though it's a small project, I think the ideas behind the Contributor Covenant are great and the repository will be maintained as described in the Code of Conduct. Please contact me at me@davidbol.es to report any potentially violating behavior or with any questions.
- ## Released under BSD0, a.k.a the "Free Public License"
  Use this code for anything you like and don't worry about having to include it's license. Just don't blame me if anything goes wrong!

# Drawbacks
- ## Testing
  Currently this project includes no automated testing and hasn't even been rigorously tested manually. I'm using it for my own project so major problems should get fixed quickly but subtle issues might be missed. Contributions welcome!
- ## Performance
  This library is semi-optimized for my needs (doing lots of interpolation over a large grid) and its caching might actually slow down other applications (e.g. scaling images down).
- ## Only Bicubic
  Only bicubic interpolation (as opposed to ncubic or other interpolation methods) is currently supported. I'd be happy for this project to extend beyond its current scope if someone want to contribute more algorithms.