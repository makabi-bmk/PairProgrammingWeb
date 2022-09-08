<template>
    
    <div>
        <table cellspacing="0">
            <tr v-for="cell in cells">
                <td v-for="i in cell" class="cell" v-on:click="clicked()">
                    <transition name="map" appear>
                    <img class="panel" v-if="i===0" src="../static/map/0.png" />
                    <img class="panel" v-if="i===1" src="../static/map/1.png" />
                    <img class="panel" v-if="i===2" src="../static/map/2.png" />
                    <img class="panel" v-if="i===3" src="../static/map/3.png" />
                    <img class="panel" v-if="i===4" src="../static/map/4.png" />
                    <img class="panel" v-if="i===5" src="../static/map/hero.png" />
                </transition>
                </td>
            </tr>
        </table>
    </div>
</template>
    
<style>
.map-enter-active, .map-leave-active {
    transition: opacity .5s;
}
.map-enter, .map-leave-to {
    opacity: 0;
}
img {
    height: 6vh;
    padding: 0px;
    margin: 0px;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
    /* height: 10%; */
}
tr {
    padding: 0px;
    margin: 0px;
    /* height: 100px; */
}
td {
    border: none;
    padding: 0px;
    margin: 0px;
    line-height: 0px;
}
table {
    padding: 0px;
    margin: 0px;
}
</style>
    
<script>
export default {
    name: 'Map',
    props: ['cells'],
    data() {
        return {
            // cells :  [
            //     [4, 0, 0, 3, 0, 0],
            //     [0, 1, 0, 0, 0, 0],
            //     [0, 0, 2, 1, 0, 0],
            //     [0, 0, 1, 0, 0, 0],
            //     [0, 0, 0, 0, 0, 0],
            //     [0, 0, 0, 0, 0, 0],
            // ]
        }
    },
    methods: {
        clicked() {
            alert("hoyo");
        },
        
    }
    
}
</script>
