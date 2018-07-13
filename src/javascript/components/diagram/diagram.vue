<template>
    <div id="diagram" :class="{empty:!data || !data.length, new:modalIsOpened}">
        <v-layout row wrap id="diagram-top-menu">
            <v-flex>
                <v-checkbox :label="`Fit to screen`" v-model="fit" light />
            </v-flex>
            <v-flex>
                <div class="pi-icon"></div>
                <div class="pi-text">{{pressType}} to add/edit block</div>
            </v-flex>
            <div class="pull-right">
                <v-btn color="primary" id="diagram-import">Import
                    <input type="file" id="diagram-file-input" @change="importDiagram" >
                </v-btn>
                <v-btn color="primary" @click="exportDiagram()">Export</v-btn>
                <v-btn color="orange" @click="savePng(4)">Download image</v-btn>
            </div>
        </v-layout>
        <div id="canvas-wrapper">
            <div id="position-info">
                <div class="pi-bg"></div>
                <span class="pi-icon"></span><br>
                <span class="pi-text">{{pressType}} to add a block</span>
            </div>
            <div v-diagram="{data:data, fit:fit, trigger:trigger}" />
        </div>

        <v-dialog v-model="modalIsOpened" max-width="600px">
            <v-card>
                <v-card-title id="add-block-modal">
                    <h4 class="modal-title">{{activeIndex < 0 ? 'New' : 'Edit'}} Diagram Block</h4>
                    <v-spacer />
                    <v-btn flat icon @click.stop="modalIsOpened=false">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-text id="add-block-modal">
                    <form>
                        <v-layout row wrap class="appearance">
                            <div>
                                <label>Type:</label><br>
                                <div class="table-bbar type">
                                    <div v-for="type in [1, 2, 3]" :key="type" :class="{selected:type == activeData.type}" @click="activeData.type = type"><i v-sampleShape="type"></i></div>
                                </div>
                            </div>
                        </v-layout>
                        <v-layout row wrap class="appearance">
                            <div>
                                <label>Style:</label><br>
                                <div class="table-bbar style">
                                    <div v-for="style in [1, 2, 3, 4]" :key="style" :class="{selected:style == activeData.style}" @click="activeData.style = style">
                                        <svg class="diagram" width="18" height="18">
                                            <g :class="'block style' + style">
                                                <circle class="shape" cx="9" cy="9" r="9" />
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </v-layout>
                        <v-layout row wrap>
                            <v-checkbox label="Resizable" v-model="activeData.resizable" />
                            <v-checkbox label="Centered" v-model="activeData.centered" />
                            <v-checkbox label="No fill" v-model="activeData.noFill" />
                            <v-checkbox label="No outline" v-model="activeData.noOutline" />
                        </v-layout>
                        <v-divider />
                        <v-text-field v-model="activeData.text" label="Text" multi-line />
                        <div class="connection" v-if="(data && (data.length > 1 || (data.length == 1 && activeIndex < 0)))">
                            <label>Connect to:</label><br>
                            <div class="scroll-wrapper">
                                <table>
                                    <tr v-for="(item, index) in data" :key="item.id" :data-id="item.id" v-if="index != activeIndex">
                                        <td><input :id="'conection-chk-' + index" type="checkbox" v-model="activeData.to[item.id]"></td>
                                        <td><label :for="'conection-chk-' + index">{{item.id}}</label></td>
                                        <td class="text"><label :for="'conection-chk-' + index">{{item.text}}</label></td>
                                        <td>
                                            <label>
                                                <input type="radio" :name="'connection-radio-' + index" value="1" v-model="activeData.to[item.id]">
                                                <svg class="line solid" width="22" height="1"><line x1="0" y1="0" x2="22" y2="0"/></svg>
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                <input type="radio" :name="'connection-radio-' + index"  value="2" v-model="activeData.to[item.id]">
                                                <svg class="line dashed" width="22" height="1"><line x1="0" y1="0" x2="22" y2="0"/></svg>
                                            </label>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </form>
                </v-card-text>
                <v-card-actions :class="{'no-border':!(data && (data.length > 1 || (data.length == 1 && activeIndex < 0)))}" id="add-block-modal">
                    <v-btn color="error" v-if="activeIndex >= 0" class="pull-left" @click="removeBlock(activeIndex, activeData.id)">Remove</v-btn>
                    <v-btn outline @click="modalIsOpened=false">Cancel</v-btn>
                    <v-btn color="primary" @click="addBlock(activeData)">{{activeIndex < 0 ? 'Add' : 'Update'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import Shape from './shape.js'
    import { svgAsDataUri } from './saveSvgAsPng.js'
    import { saveAs } from 'file-saver'

    export default {
        name: 'diagram',
        components: {
            FontAwesomeIcon
        },
        beforeMount () {
            this.activeData = jQuery.extend(true, {}, this.defData)
            this.isTouchDevice = 'ontouchstart' in document.documentElement
            this.reader  = new FileReader();
            var self = this;
            this.reader.onload = function(event) {
                self.data = JSON.parse(event.target.result);
                self.trigger = !self.trigger;
            }
        },
        data () {
            return {
                data: [],
                modalIsOpened: false,
                fit: false,
                defData: {id:0, type:1, style:1, x:0, y:0, width:'auto', to:[], text:''},
                activeData: {},
                activeIndex: -1,
                isTouchDevice: false,
                trigger: false,
                clickTimeout: null,
                clickCoord: {x: 0, y:0},
                prevWidth: 0,
                canvasWidth: 1600,
                shapesById: {},
                reader: null
            }
        },
        computed: {
            pressType () {
                return this.isTouchDevice ? 'Taphold' : 'Double-click'
            }
        },
        watch: {
            modalIsOpened: function (newValue) {
                if (!newValue) {
                    $(".click-pt")[0].setAttribute('class', 'click-pt')
                }
            }
        },
        methods: {
            importDiagram (event) {
                var f = event.target.files[0];

                if (f) {
                    this.reader.readAsText(f);
                }
            },
            exportDiagram () {
                saveAs(new Blob([JSON.stringify(this.data)], {type: "text/plain;charset=utf-8"}), "diagram.json");
            },
            getSVGBox(scale) {
                var blocks = $('#diagram-svg .block');
                var box = {left:0, top:0, right: 0, bottom: 0};
                var shape;

                if (!blocks.length) {
                return box;
                }

                box.left = Infinity;
                box.top = Infinity;
                
                blocks.each(function(index) {
                shape = $(this).data('shape');
                var pos = {left:shape.absX(), top: shape.absY()};
                var size = this.getBBox();
                pos.left += size.x;
                pos.top += size.y;
                box.left = Math.min(box.left, pos.left);
                box.top = Math.min(box.top, pos.top);
                box.right = Math.max(box.right, pos.left + size.width);
                box.bottom = Math.max(box.bottom, pos.top + size.height);
                });

                for (var key in box) {
                box[key] *= scale;
                }

                return box;
            },
            savePng (scale) {
                var box = this.getSVGBox(scale);
                var border = 10;

                svgAsDataUri(document.getElementById("diagram-svg"), {scale: scale}, function(uri) {
                    var image = new Image();
                    image.onload = function() {
                        var canvas = document.createElement('canvas');
                        canvas.width = box.right - box.left + border * 2;
                        canvas.height = box.bottom - box.top + border * 2;
                        var context = canvas.getContext('2d');
                        context.drawImage(image, -box.left + border, -box.top + border);

                        canvas.toBlob(function(blob) {saveAs(blob, "diagram.png"), "image/png"});
                    }
                    image.src = uri;
                });
            },
            removeBlock (index, id) {
                this.data.splice(index, 1);
                this.data.forEach(function(value) {
                    delete value.to[id];
                });
                this.modalIsOpened = false;
                this.trigger = !this.trigger;
            },
            addBlock (data) {
                var to = {};

                for (const id in this.activeData.to) {
                    const type = this.activeData.to[id]
                    if (type == 1 || type == 2) {
                        to[id] = type;
                    }
                }

                data.to = to;

                if (this.activeIndex > -1) {
                    this.data[this.activeIndex] = data;
                } else {
                    this.data.push(data);
                }

                this.modalIsOpened = false;

                this.trigger = !this.trigger;
            }
        },
        directives: {
            sampleShape: {
                bind: function (ele, binding) {
                    var w = 22, h = 18, sd = 6, bd = 4;
                    var type = binding.value;
                    var ns = "http://www.w3.org/2000/svg";
                    var svg = document.createElementNS(ns, "svg");
                    $(svg).css({'overflow':'visible'});
                    svg.setAttribute('width', w);
                    svg.setAttribute('height', h);
                    svg.setAttribute('class', 'diagram');

                    var shapeH = type == 2 ? h - sd / 2 : h;
                    var shape = new Shape({width:w, height:shapeH, type:type, sd:sd, bd:bd}, svg);
                    ele.append(svg);
                }
            },
            diagram: {
                bind: function (ele, binding, vnode) {
                    var ns = "http://www.w3.org/2000/svg";
                    var svg = document.createElementNS(ns, "svg");
                    svg.setAttribute('class', 'diagram');
                    svg.setAttribute('id', 'diagram-svg');
                    // svg.setAttribute('xmlns', ns);
                    $(ele).css({'overflow':'auto', 'position':'relative'});

                    var bgLayer = document.createElementNS(ns, "rect");
                    var activeLayer = document.createElementNS(ns, "rect");
                    var linesLayer = document.createElementNS(ns, "svg");
                    var activeLayer = document.createElementNS(ns, "rect");
                    var shapesLayer = document.createElementNS(ns, "svg");

                    var clickPoint = document.createElementNS(ns, "circle");
                    clickPoint.setAttribute('r', '6');
                    clickPoint.setAttribute('class', 'click-pt');

                    svg.appendChild(bgLayer);
                    svg.appendChild(linesLayer);
                    svg.appendChild(clickPoint);
                    svg.appendChild(activeLayer);
                    svg.appendChild(shapesLayer);

                    activeLayer.setAttribute('x', '0');
                    activeLayer.setAttribute('y', '0');
                    activeLayer.setAttribute('width', '100%');
                    activeLayer.setAttribute('height', '100%');
                    activeLayer.setAttribute('fill', '#ffffff');
                    activeLayer.setAttribute('fill-opacity', '0');
                    activeLayer.setAttribute('class', 'active-layer');
                    linesLayer.setAttribute('class', 'lines-layer');
                    shapesLayer.setAttribute('class', 'shapes-layer');
                    shapesLayer.setAttribute('x', '0');
                    shapesLayer.setAttribute('y', '0');

                    svg.setAttribute('width', vnode.context.canvasWidth);
                    svg.setAttribute('height', 800);
                    ele.append(svg);

                    function openModal () {
                        clearTimeout(vnode.context.clickTimeout);

                        vnode.context.modalIsOpened = true;
                    }

                    function setNewBlockCoordinates(event) {
                        var canvas = $("#diagram-svg");
                        var offset = canvas.offset();
                        var clickPoint = $(".click-pt")[0];
                        vnode.context.clickCoord.x = (event.pageX - offset.left) / canvas.width() * 100 + '%';
                        vnode.context.clickCoord.y = (event.pageY - offset.top) / canvas.height() * 100 + '%';
                        clickPoint.setAttribute('cx', vnode.context.clickCoord.x);
                        clickPoint.setAttribute('cy', vnode.context.clickCoord.y);
                    }

                    function getNewId() {
                        var id, maxId = 0;
                        vnode.context.data.forEach(function(value) {
                            maxId = Math.max(maxId, parseInt(value.id) || 0);
                        });
                        return maxId + 1;
                    }

                    $(activeLayer).on('dblclick taphold', function(event){
                        var scope = vnode.context;
                        clickPoint.setAttribute('class', 'click-pt active-pt');
                        scope.activeIndex = -1;
                        scope.activeData = jQuery.extend(true, {}, scope.defData);
                        scope.activeData.id = getNewId();
                        scope.activeData.x = scope.clickCoord.x;
                        scope.activeData.y = scope.clickCoord.y;
                        openModal(event);
                    }).on('mousedown', function(event) {
                        setNewBlockCoordinates(event);
                        clickPoint.setAttribute('class', 'click-pt down-pt');
                        clearTimeout(vnode.context.clickTimeout);
                        vnode.context.clickTimeout = setTimeout(function(){
                            clickPoint.setAttribute('class', 'click-pt');
                        }, 1000);
                    });
                },
                update: function (ele, binding, vnode) {
                    var ns = "http://www.w3.org/2000/svg";

                    function addClass(target, className) {
                        $(target).attr('class', function(index, classNames) {
                        return classNames + ' ' + className;
                        });
                    }

                    function removeClass(target, className) {
                        $(target).attr('class', function(index, classNames) {
                        return classNames.replace(className, '');
                        });
                    }

                    function drawConnectionsForShape(shape) {
                        var shapesById = vnode.context.shapesById;
                        var to;
                        for (var key in shapesById) {
                            to = shapesById[key].data.to;
                            for (const key2 in to) {
                                if (key2 == shape.data.id) {
                                    drawConnections(shapesById[key]);
                                }
                            }
                        }
                        drawConnections(shape);
                    }

                    function drawConnections(shape) {
                        var i, line, shape2, angle, coord, coord2, position;
                        var to = shape.data.to;
                        var counts = {};
                        var shapesById = vnode.context.shapesById;
                        var linesLayer = $(".lines-layer")[0];

                        while (shape.lines && shape.lines.length) {
                        $(shape.lines.pop()).remove();
                        }

                        for (const key in to) {
                            if (typeof counts[key] == 'undefined') counts[key] = {total:0, current:0};
                            counts[key].total++;
                        }

                        for (const key in to) {
                            const value = to[key];
                            shape2 = shapesById[key];
                            if (shape2) {
                                angle = Math.atan2(shape2.cY() - shape.cY(), shape2.cX() - shape.cX());
                                angle -= Math.PI / 2;
                                counts[key].current++;

                                position = counts[key].total > 1 ? counts[key].current / (counts[key].total - 1) : 1;
                                coord = getConnectionOffset(shape, angle, position);
                                coord2 = getConnectionOffset(shape2, angle + Math.PI, 0);

                                line = document.createElementNS(ns, "path");
                                line.setAttribute('d', getPath(angle, {x:coord.x + shape.cX(), y:coord.y + shape.cY()}, {x:coord2.x + shape2.cX(), y:coord2.y + shape2.cY()}));
                                line.setAttribute('class', 'connection line' + value);
                                linesLayer.appendChild(line);
                                shape.lines.push(line);
                            }
                        }
                    }

                    function getPath(angle, coord, coord2) {
                        angle += Math.PI * 0.02;
                        var dist = lineDistance(coord, coord2);
                        var offset = rotate(0, dist/2, angle);
                        var offset2 = rotate(0, dist/2, -angle);
                        var c = [coord.x, coord.y, coord.x + offset.x, coord.y + offset.y, coord2.x, coord2.y].join(' ');
                        return  'M' + coord.x + ' ' + coord.y + 'C' + c;
                    }

                    function lineDistance(point1, point2){
                        var xs = 0;
                        var ys = 0;
                    
                        xs = point2.x - point1.x;
                        xs = xs * xs;
                    
                        ys = point2.y - point1.y;
                        ys = ys * ys;
                    
                        return Math.sqrt( xs + ys );
                    }

                    function getConnectionOffset(shape, angle, position) {
                        var maxLen = Math.min(shape.w/2, shape.h/2);
                        var coord = rotate(0, maxLen, angle + Math.PI / 4 * position);
                        return coord;
                        // var sW = shape.w - 6, sH = shape.h - 6;
                        // return intersectRectangle(-sW / 2, -sH / 2, sW, sH, 0, 0, coord.x, coord.y);
                    }

                    function ccw(x1, y1, x2, y2, x3, y3) {           
                        var cw = ((y3 - y1) * (x2 - x1)) - ((y2 - y1) * (x3 - x1));
                        return cw > 0 ? true : cw < 0 ? false : true;
                    };

                    function intersectLine(x1, y1, x2, y2, x3, y3, x4, y4) {
                        var s1_x, s1_y, s2_x, s2_y;
                        s1_x = x2 - x1;     s1_y = y2 - y1;
                        s2_x = x4 - x3;     s2_y = y4 - y3;

                        var s, t;
                        s = (-s1_y * (x1 - x3) + s1_x * (y1 - y3)) / (-s2_x * s1_y + s1_x * s2_y);
                        t = ( s2_x * (y1 - y3) - s2_y * (x1 - x3)) / (-s2_x * s1_y + s1_x * s2_y);

                        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
                            var atX = x1 + (t * s1_x);
                            var atY = y1 + (t * s1_y);
                            return { x: atX, y: atY };
                        }

                        return false;
                    };

                    function intersectRectangle(rx, ry, rWidth, rHeight, x1, y1, x2, y2) {
                        var result, l, lines = [
                        [rx, ry, rx + rWidth, ry],
                        [rx + rWidth, ry, rx + rWidth, ry + rHeight],
                        [rx + rWidth, ry + rHeight, rx, ry + rHeight],
                        [rx, ry + rHeight, rx, ry]
                        ]

                        for (var i in lines) {
                        l = lines[i];
                        result = intersectLine(l[0], l[1], l[2], l[3], x1, y1, x2, y2);
                        if (result) return result;
                        }

                        return false;
                    }

                    function rotate(x, y, angle, oX, oY) {
                        var cos, sin, tx, ty;
                        oX = oX || 0;
                        oY = oY || oX;
                        cos = Math.cos(angle);
                        sin = Math.sin(angle);
                        tx = x * cos - y * sin;
                        ty = x * sin + y * cos;
                        return {
                            x: tx + oX,
                            y: ty + oY
                        };
                    }

                    function drawAllLines() {
                        $(".lines-layer").empty();
                        var shapesById = vnode.context.shapesById;
                        for (var key in shapesById) {
                            drawConnections(shapesById[key]);
                        }
                    }

                    function adjustCanvas() {
                        var width = $(ele).width();
                        if (width != vnode.context.prevWidth) {
                            if (binding.value.fit) {
                                $("#diagram-svg")[0].setAttribute('width', $(ele).width());
                            }
                            else {
                                $("#diagram-svg")[0].setAttribute('width', vnode.context.canvasWidth);
                            }
                            drawAllLines();
                        }
                        vnode.context.prevWidth = width;
                    }

                    function initFit() {
                        vnode.context.prevWidth = 0;
                        if (binding.value.fit) {
                            $(window).on('resize', function() {
                                clearTimeout(timeout);
                                timeout = setTimeout(function() {adjustCanvas()}, 100);
                            });
                        } else {
                            $(window).off('resize');
                        }
                        adjustCanvas();
                    }

                    function redraw() {
                        var linesLayer = $(".lines-layer")[0]
                        var shapesLayer = $(".shapes-layer")[0]
                        $(linesLayer).empty();
                        $(shapesLayer).empty();
                        vnode.context.shapesById = {};
                        var shapesById = vnode.context.shapesById;

                        for (var i = 0; i < binding.value.data.length; i++) {
                            var shape = new Shape(binding.value.data[i], shapesLayer, i);
                            shapesById[shape.data.id] = shape;

                            $(shape.node).on('shape:down', function(event) {
                            });

                            $(shape.node).on('shape:sizeChanged', function(event, oEvent, shape){
                                drawConnectionsForShape($(event.target).data('shape'));
                            });

                            $(shape.node).on('shape:sizeChangedComplete', function(event, oEvent, shape){
                                shape.data.width = shape.w;
                                shape.data.height = shape.h;
                            });

                            $(shape.node).on('shape:mousedown', function(event, oEvent){
                                var activeShape = $(event.target).data('shape');
                                var offset = activeShape.offset();
                                var svg = $("#diagram-svg")[0];

                                activeShape.moved = false;
                                offset.left -= oEvent.pageX;
                                offset.top -= oEvent.pageY;
                                addClass(svg, 'noselect');
                                addClass(activeShape.node, 'active');

                                $(svg).on('mousemove', function(e) {
                                var oX = (e.pageX - $(svg).offset().left);
                                var oY = (e.pageY - $(svg).offset().top);
                                activeShape.position(oX + offset.left, oY + offset.top);
                                drawConnectionsForShape(activeShape);
                                activeShape.moved = true;
                                });

                                $(svg).on('mouseup', function() {
                                    removeClass(activeShape.node, 'active');
                                    removeClass(svg, 'noselect');
                                    activeShape.data.x = activeShape.absX() / $(svg).width() * 100 + '%';
                                    activeShape.data.y = activeShape.absY() / $(svg).height() * 100 + '%';
                                    activeShape = null;
                                    $(svg).off('mousemove');
                                    $(svg).off('mouseup');
                                });
                            }).on('shape:dblclick shape:taphold', function(event){
                                var targetShape = $(event.target).data('shape');
                                if (!targetShape.moved) {
                                    vnode.context.activeIndex = targetShape.index;
                                    vnode.context.activeData = jQuery.extend(true, {}, targetShape.data);
                                    
                                    clearTimeout(vnode.context.clickTimeout);
                                    vnode.context.modalIsOpened = true;
                                }
                            });
                        }

                        drawAllLines();
                    }

                    if (binding.value.fit != binding.oldValue.fit) {
                        initFit();
                        redraw();
                    } else if (binding.value.trigger != binding.oldValue.trigger) {
                        redraw();
                    }
                }
            }
        }
    }
</script>
<!-- styling for the component -->
<style scoped>

</style>
