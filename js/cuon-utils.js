/**
 *  * Creates a webgl context.
 *   * @param {!Canvas} canvas The canvas tag to get context
 *    *     from. If one is not passed in one will be created.
 *     * @return {!WebGLContext} The created context.
 *      */
var getWebGLContext = function(canvas, opt_attribs) {
	  var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
	  var context = null;
	  for (var ii = 0; ii < names.length; ++ii) {
			    try {
						      context = canvas.getContext(names[ii], opt_attribs);
						    } catch(e) {}
			    if (context) {
						      break;
						    }
			  }
	  return context;
}
