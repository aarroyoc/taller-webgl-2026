function main() {
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(1, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
}

main();
