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
        // front face
        -0.3, -0.3, 0.3,
        0.3, -0.3, 0.3,
        -0.3, 0.3, 0.3,

        0.3, 0.3, 0.3,
        -0.3, 0.3, 0.3,
        0.3, -0.3, 0.3,

        // up face
        -0.3, 0.3, 0.3,
        0.3, 0.3, -0.3,
        -0.3, 0.3, -0.3,

        -0.3, 0.3, 0.3,
        0.3, 0.3, 0.3,
        0.3, 0.3, -0.3,

        //left face
        -0.3, -0.3, 0.3,
        -0.3, 0.3, 0.3,
        -0.3, 0.3, -0.3,

        -0.3, -0.3, -0.3,
        -0.3, -0.3, 0.3,
        -0.3, 0.3, -0.3,

        // right face
        0.3, -0.3, 0.3,
        0.3, 0.3, 0.3,
        0.3, 0.3, -0.3,

        0.3, -0.3, -0.3,
        0.3, -0.3, 0.3,
        0.3, 0.3, -0.3,

        // bottom face
        -0.3, -0.3, 0.3,
        0.3, -0.3, -0.3,
        -0.3, -0.3, -0.3,

        -0.3, -0.3, 0.3,
        0.3, -0.3, 0.3,
        0.3, -0.3, -0.3,

        // back face
        -0.3, -0.3, -0.3,
        0.3, -0.3, -0.3,
        -0.3, 0.3, -0.3,

        0.3, 0.3, -0.3,
        -0.3, 0.3, -0.3,
        0.3, -0.3, -0.3        
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const colorAttributeLocation = gl.getAttribLocation(program, "color");
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // front face
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        // up
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        // left
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,

        1, 0, 1,
        1, 0, 1,
        1, 0, 1,

        // right
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        // bottom
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        // back
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,

        0, 1, 1,
        0, 1, 1,
        0, 1, 1,       
    ]), gl.STATIC_DRAW);

    const matrixUniform = gl.getUniformLocation(program, "matrix");
    const matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    function mat4Multiply(a, b) {
        return [
            a[0]*b[0] + a[1]*b[4] + a[2]*b[8] + a[3]*b[12],
            a[0]*b[1] + a[1]*b[5] + a[2]*b[9] + a[3]*b[13],
            a[0]*b[2] + a[1]*b[6] + a[2]*b[10] + a[3]*b[14],
            a[0]*b[3] + a[1]*b[7] + a[2]*b[11] + a[3]*b[15],
            a[4]*b[0] + a[5]*b[4] + a[6]*b[8] + a[7]*b[12],
            a[4]*b[1] + a[5]*b[5] + a[6]*b[9] + a[7]*b[13],
            a[4]*b[2] + a[5]*b[6] + a[6]*b[10] + a[7]*b[14],
            a[4]*b[3] + a[5]*b[7] + a[6]*b[11] + a[7]*b[15],
            a[8]*b[0] + a[9]*b[4] + a[10]*b[8] + a[11]*b[12],
            a[8]*b[1] + a[9]*b[5] + a[10]*b[9] + a[11]*b[13],
            a[8]*b[2] + a[9]*b[6] + a[10]*b[10] + a[11]*b[14],
            a[8]*b[3] + a[9]*b[7] + a[10]*b[11] + a[11]*b[15],
            a[12]*b[0] + a[13]*b[4] + a[14]*b[8] + a[15]*b[12],
            a[12]*b[1] + a[13]*b[5] + a[14]*b[9] + a[15]*b[13],
            a[12]*b[2] + a[13]*b[6] + a[14]*b[10] + a[15]*b[14],
            a[12]*b[3] + a[13]*b[7] + a[14]*b[11] + a[15]*b[15]
        ];            
    }
    
    let previousTime = Date.now();
    let angleX = Math.PI/4;
    let angleY = Math.PI/4;


    gl.enable(gl.DEPTH_TEST);
    
    function loop() {
        const currentTime = Date.now();
        const delta = currentTime - previousTime;
        previousTime = currentTime;
        
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        

        gl.useProgram(program);

        angleX += delta * 0.001;
        angleY += delta * 0.002;

        const rotateX = [
            1, 0, 0, 0,
            0, Math.cos(angleX), Math.sin(angleX), 0,
            0, -Math.sin(angleX), Math.cos(angleX), 0,
            0, 0, 0, 1];
        const m0 = mat4Multiply(rotateX, matrix);
        const rotateY = [
            Math.cos(angleY), 0, -Math.sin(angleY), 0,
            0, 1, 0, 0,
            Math.sin(angleY), 0, Math.cos(angleY), 0,
            0, 0, 0, 1];
        const m1 = mat4Multiply(rotateY, m0);

        gl.uniformMatrix4fv(matrixUniform, false, m1);
        
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const size = 3;
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
        
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

main();
