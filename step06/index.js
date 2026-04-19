function main() {
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const vertexShaderText = `
        attribute vec4 position;
        attribute vec3 color;

        uniform mat4 matrix;

        varying vec3 v_color;

        void main() {
          gl_Position = matrix * position;
          v_color = color;
        }
    `;

    const fragmentShaderText = `
        precision mediump float;

        varying vec3 v_color;

        void main() {
          gl_FragColor = vec4(v_color, 1);
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
    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -0.5, 0,
        0.5, 0,
        0, 0.5
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const colorAttributeLocation = gl.getAttribLocation(program, "color");
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1]), gl.STATIC_DRAW);

    const matrixUniform = gl.getUniformLocation(program, "matrix");
    const matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    
    let previousTime = Date.now();
    let angle = 0;

    function loop() {
        const currentTime = Date.now();
        const delta = currentTime - previousTime;
        previousTime = currentTime;
        
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        angle += delta * 0.001

        matrix[0] = Math.cos(angle);
        matrix[3] = -Math.sin(angle);
        matrix[8] = Math.sin(angle);
        matrix[10] = Math.cos(angle);

        gl.uniformMatrix4fv(matrixUniform, false, matrix);
        
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
        
        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(
            colorAttributeLocation,
            3,
            gl.FLOAT,
            false,
            0,
            0);
        
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

main();
