
function ycbigimg(thisobj,name,index){
    //放大图片
    var $y = {};
    $y.all = function(selector, contextElement) {
        var nodeList,
            list = [];
        if (contextElement) {
            nodeList = contextElement.querySelectorAll(selector);
        } else {
            nodeList = document.querySelectorAll(selector);
        }
        if (nodeList && nodeList.length > 0) {
            list = Array.prototype.slice.call(nodeList);
        }
        return list;
    }
    $y.delegate = function($el, eventType, selector, fn) {
        if (!$el) { return; }
        $el.addEventListener(eventType, function(e) {
            var targets = $y.all(selector, $el);
            if (!targets) {
                return;
            }
            // findTarget:
            for (var i=0; i<targets.length; i++) {
                var $node = e.target;
                while ($node) {
                    if ($node == targets[i]) {
                        fn.call($node, e);
                        break; //findTarget;
                    }
                    $node = $node.parentNode;
                    if ($node == $el) {
                        break;
                    }
                }
            }
        }, false);
    };
    var urls = [];
    var imgs = $y.all('img',$y.all(name)[index]);
    imgs.forEach(function(v,i){
        urls.push(v.src);
    })
    var current = thisobj.src;
    var obj = {
        urls : urls,
        current : current
    };
    previewImage.start(obj);
}
