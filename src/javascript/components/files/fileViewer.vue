<template>
    <div id="fileViewer">
        <canvas id="image-display" ref="imagedisplayref"></canvas>
    </div>
</template>

<script>
    import organizationFileService from '../../service/network/organizationFileService'
    import {organizationFileHTTP} from '../../service/network/urlProvider'
    import store from "../../store"

    export default {
        name: 'fileViewer',
        props: ['documentId', 'pageNumber'],
        mounted() {
            this.$root.showToolbar = false
            this.$root.drawer = false
            const that = this
            this.image.onload = function() { that.resizeWindow();}
            window.addEventListener('resize', that.resizeWindow, false);
            this.loadImage()

        },
        computed: {
            token() {
                return store.state.userProfile.user.token
            }
        },
        data () {
            return {
                image: new Image(),
                pageIndex: parseInt(this.pageNumber),
                max: 1,
                pages: {},
                sprites: {}
            }
        },
        watch: {
            pageIndex: function() {
                this.loadImage()
            }
        },
        created () {
            const that = this
            window.addEventListener('keydown', function (event) {
                if (event.code == 'ArrowRight') {
                    console.log('ArrowRight')
                    that.pageIndex = that.pageIndex + 1
                }
                if (event.code == 'ArrowLeft') {
                    console.log('ArrowLeft')
                    that.pageIndex = that.pageIndex - 1
                }
            })
        },
        methods: {
            loadImage () {
                let that = this;

                organizationFileService.getPageMapFullSize(this.documentId)
                    .then(response => {
                        console.log(response)
                        that.pages[that.documentId] = response["pages"]
                        that.max = that.pages[that.documentId].length

                        var fileIndex = 0

                        that.sprites[that.documentId] = []
                        let first_sprite = true
                        response["filenames"].forEach(function (filename) {
                            var image = new Image()
                            var sprite_url = organizationFileHTTP.previewUrl(that.documentId).fullSizeImage + filename +
                                '?token=' + that.token

                            console.log(sprite_url)

                            if (first_sprite)
                            {
                                first_sprite = false
                                image.addEventListener('load', function() {that.renderCurrentPage()} )
                            }

                            image.src = sprite_url

                            that.sprites[that.documentId][fileIndex] = image

                            fileIndex++
                        })
                    })
            },
            renderCurrentPage: function () {
                this.resizeWindow()

                var page_data = this.pages[this.documentId][this.pageIndex - 1]

                var spriteIndex = page_data[0]

                let sprite_height = this.sprites[this.documentId][spriteIndex].height

                console.log("sprite_height: " + sprite_height)

                let sprite_image = this.sprites[this.documentId][spriteIndex]


                const canvas = document.getElementById("image-display");

                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = page_data[2];
                canvas.height = page_data[3];

                ctx.drawImage(sprite_image, 0, page_data[1], page_data[2], page_data[3], 0, 0, canvas.width, canvas.height);
                this.image = sprite_image.getImageData(0, page_data[1], page_data[2], page_data[3])
                //console.log(page_data[1], page_data[2],page_data[3])
                //this.resizeWindow()
            },
            clearCurrentPage: function () {
                const canvas = document.getElementById("image-display");
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            },
            resizeWindow () {
                const htmlCanvas = document.getElementById('image-display')
                const context = htmlCanvas.getContext('2d')

                htmlCanvas.height = this.image.height;
                htmlCanvas.width  = this.image.width;

                htmlCanvas.style.height = window.innerHeight + "px";

                const scalingFactor = window.innerHeight     / htmlCanvas.height;
                const ratio = 1 / scalingFactor;

                htmlCanvas.style.width = (htmlCanvas.width * scalingFactor) + "px";

                context.setTransform(ratio, 0, 0, ratio, 0, 0);
                context.scale(scalingFactor, scalingFactor)

                //context.drawImage(this.image, 0, 0);
            },
            padToFive(number) {
                if (number<=99999) { number = ("0000"+number).slice(-5); }
                return number;
            }
        }
    }
</script>
