<template>
    <div id="FilePreview">
        <vue-slider ref="slider" :lazy="true" v-model="pageIndex"
                    :min="1" :max="max" tooltip-dir="bottom"
                    direction="horizontal" :width="400"></vue-slider>
        <div id="page" v-on:click="showFullsize">
            <canvas id="image-display" ref="imagedisplayref"></canvas>
        </div>
    </div>
</template>

<script>
    import vueSlider from 'vue-slider-component';
    import organizationFileService from '../../service/network/organizationFileService'
    import {organizationFileHTTP} from '../../service/network/urlProvider'
    import store from "../../store"

    export default {
        name: 'FilePreview',
        components: {
            vueSlider, organizationFileService
        },
        props: ['documentId'],
        data() {
            return {
                pageIndex: 1,
                max: 1,
                pages: {},
                sprites: {}
            }
        },
        computed: {
            url () {
                return "#/file/viewer/" + this.documentId + "/" + this.pageIndex
            },
            token() {
                return store.state.userProfile.user.token
            }
        },
        created () {
            const that = this
            window.addEventListener('keydown', function (event) {
                if (event.code == 'ArrowRight' && that.pageIndex < that.max) {
                    // console.log('ArrowRight')
                    that.pageIndex = that.pageIndex + 1
                }
                if (event.code == 'ArrowLeft' && that.pageIndex > 0) {
                    // console.log('ArrowLeft')
                    that.pageIndex = that.pageIndex - 1
                }
            })
        },
        watch: {
            pageIndex: function (newValue) {
                if (this.pageIndex < 1) {
                    return;
                }

                this.renderCurrentPage();
            },
            documentId: function () {
                console.log('documentId set to ' + this.documentId)
                this.clearCurrentPage()
                if (this.documentId == '') {
                    return
                }
                if (this.sprites[this.documentId]) {
                    this.max = this.pages[this.documentId].length
                    if (this.pageIndex != 1) {
                        this.pageIndex = 1
                    }
                    else {
                        this.renderCurrentPage()
                    }
                }
                else {
                    let that = this;

                    organizationFileService.getPageMap(this.documentId)
                        .then(response => {
                            console.log(response)
                            that.pages[that.documentId] = response["pages"]
                            that.max = that.pages[that.documentId].length

                            var fileIndex = 0

                            that.sprites[that.documentId] = []
                            let first_sprite = true
                            response["filenames"].forEach(function (filename) {
                                var image = new Image()
                                var sprite_url = organizationFileHTTP.previewUrl(that.documentId).previewImage + filename +
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

                                that.pageIndex = 1
                            })
                        })
                }
            }
        },
        methods: {
            renderCurrentPage: function () {
                var page_data = this.pages[this.documentId][this.pageIndex - 1]

                var spriteIndex = page_data[0]

                let sprite_height = this.sprites[this.documentId][spriteIndex].height

                console.log("sprite_height: " + sprite_height)

                var image = this.sprites[this.documentId][spriteIndex]


                const canvas = document.getElementById("image-display");

                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = page_data[2];
                canvas.height = page_data[3];

                ctx.drawImage(image, 0, page_data[1], page_data[2], page_data[3], 0, 0, canvas.width, canvas.height);
                console.log(page_data[1], page_data[2],page_data[3])
            },
            clearCurrentPage: function () {
                const canvas = document.getElementById("image-display");
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            },
            showFullsize: function () {
                window.open(this.url)
            }
        }
    }


</script>
<!-- styling for the component -->
<style scoped>
    #FilePreview {
        position: absolute;
        overflow: hidden;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        background: white;
        padding-left: 20px;
    }
    #image-display {
        border: solid black 1px;
        height: 500px;
        width: 400px;
        background-repeat: no-repeat;
    }
    #page {
        cursor: pointer;
        margin-top: 30px;
    }
</style>