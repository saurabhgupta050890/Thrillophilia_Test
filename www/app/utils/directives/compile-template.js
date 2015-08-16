/**
 * Created by Saurabh on 10-08-2015.
 *
 * @ngdoc directive
 * @restrict E
 * @module directives
 *
 * @attribute {string=} dynamic-template The template to be compiled and rendered
 * @attribute {object=} dynamic-data The data to which the template is bound to
 *
 * @description
 * Directive to compile and transform a dynamic HTML template bound with a data object.
 * This directive will replace the in between image keys with image tags
 * It can also be used to render a Rich Text String containing HTML and CSS
 * Both attributes are compulsory. Pass empty object of template is not bound to any dynamic data
 *
 * @usage
 * ```html
 * <tp-rich-text dynamic-template={{template}} dynamic-data={{data}}></tp-rich-text>
 * ```
 *
 */
angular.module('directives.compileTemplate',[]).directive('tpRichText', function factory($compile) {
    return {
        restrict: 'E',
        replace: true,
        scope: "true",
        template: '',
        link: function(scope, elements, iAttrs) {
            try {
                if(iAttrs.dynamicTemplate!= "" && iAttrs.dynamicTemplate != null && iAttrs.dynamicData != "" && iAttrs.dynamicData != null){
                    scope.object =  JSON.parse(iAttrs.dynamicData);

                    //dynamicTemplate have a key needs to be replaced by image.
                    if(iAttrs.dynamicTemplate.indexOf(scope.object.in_between_image_replace_key) >=0 ) {
                        console.log("Image replacements found");
                        var reg = new RegExp(scope.object.in_between_image_replace_key,'g');

                        //Replacing key with a img tag if there is in_between_image exists
                        iAttrs.dynamicTemplate = iAttrs.dynamicTemplate.replace(reg,'<img ng-if="object.in_between_image" ng-src="{{object.in_between_image.size_lp_medium || object.in_between_image.size_large}}" style="display: block">');
                    }
                    var elem = angular.element("<div>"+ iAttrs.dynamicTemplate +"</div>");
                    elements.append($compile(elem)(scope));
                } else {
                    console.error("Insufficient Data to Compile Template");
                }
            } catch (e) {
                console.info(e);
            }
        }
    };
});