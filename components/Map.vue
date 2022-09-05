<template>
    <div>
    <p>mappppp</p>
    <table border="1" cellspacing="0">
        <tr v-for="cell in cells">
            <td v-for="i in cell" class="cell" v-on:click="clicked()">
                <span v-if="i===1">&#x26AB;</span>
                <span v-if="i===-1">&#x26AA;</span>
                <span v-if="i===0"></span>
            </td>
        </tr>
    </table>
</div>
</template>
    
<style scoped>
    /* CSSを記述 */
</style>
    
<script>
var cells =  [
	[0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0],
	[0, 0,-1, 1, 0, 0],
	[0, 0, 1,-1, 0, 0],
	[0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0],
];
export default {
    methods: {
        clicked() {
            alert("hoyo");
        },
    }
    
}
</script>
