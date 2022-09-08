<template>
    <div>
        <table cellspacing="0">
            <tr v-for="cell in cells">
                <td v-for="i in cell" class="cell" v-on:click="clicked()">
                    <img class="panel" v-if="i===0" src="../static/map/0.png" />
                    <img class="panel" v-if="i===1" src="../static/map/1.png" />
                    <img class="panel" v-if="i===2" src="../static/map/2.png" />
                    <img class="panel" v-if="i===3" src="../static/map/3.png" />
                    <img class="panel" v-if="i===4" src="../static/map/hero.png" />
                </td>
            </tr>
        </table>
    </div>
</template>
    
<style>
img {
    /* height: 70px; */
    /* height:3.8095em; */
    height: 3.82em;
    padding: 0px;
    margin: 0px;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
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
