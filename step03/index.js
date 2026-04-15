function main() {
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const vertexShaderText = `
        attribute vec4 position;

        void main() {
          gl_Position = position;
        }
    `;

    const fragmentShaderText = `
        precision mediump float;

        uniform vec4 color;

        void main() {
          gl_FragColor = color;
        }
    `;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.compileShader(vertexShader);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    gl.compileShader(fragmentShader);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    
    const colorUniformLocation = gl.getUniformLocation(program, "color");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -0.5, 0,
        0.5, 0,
        0, 0.5
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    function loop() {
        gl.clearColor(1, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(
            positionAttributeLocation,
            size,
            type,
            normalize,
            stride,
            offset);
        gl.uniform4f(colorUniformLocation, 0, 1, 0, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -0.5, -0.5,
            0.5, -0.5,
            0, 0,
        ]), gl.STATIC_DRAW);
        gl.uniform4f(colorUniformLocation, 0, 0, 1, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        
    }

    requestAnimationFrame(loop);
}

main();
