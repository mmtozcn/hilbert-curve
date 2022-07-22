function hindex2xy(hindex, N) {
    const positions = [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0]
    ];
    const last2bits = x => (x & 3);

    let tmp = positions[last2bits(hindex)];
    hindex = (hindex >>> 2);

    let x = tmp[0];
    let y = tmp[1];

    for (let n = 4; n <= N; n *= 2) {
        let n2 = n / 2;

        switch (last2bits(hindex)) {
            case 0: /* left-bottom */
                tmp = x;
                x = y;
                y = tmp;
                break;

            case 1: /* left-upper */
                y = y + n2;
                break;

            case 2: /* right-upper */
                x = x + n2;
                y = y + n2;
                break;

            case 3: /* right-bottom */
                tmp = y;
                y = (n2 - 1) - x;
                x = (n2 - 1) - tmp;
                x = x + n2;
                break;
        }
        hindex = (hindex >>> 2);
    }
    return [x, y];
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function hilbert(level = 1) {
    const N = Math.pow(2, level);
    const nSquared = N * N;
    let prev = [0, 0],
        curr;

    const blockSize = Math.floor(canvas.width / N);
    const offset = blockSize / 2;

    ctx.fillStyle = "transparent";
    ctx.lineCap = "round";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3;

    for (let i = 0; i < nSquared; i += 1) {
        window.setTimeout(() => {
            const color = Math.floor(360 * (level * 2 / 5));
            ctx.strokeStyle = 'hsl(' + color + ', 50%, 50%)';
            curr = hindex2xy(i, N);
            if (prev !== curr) {
                line(prev, curr);
            }
            prev = curr;
            if (i === nSquared - 1) {
                if (level < 5) {
                    hilbert(level + 1);
                }
            }
        }, level * 100 * i / 10);
    }

    function line(from, to) {
        const off = offset;
        ctx.beginPath();
        ctx.moveTo(from[0] * blockSize + off, from[1] * blockSize + off);
        ctx.lineTo(to[0] * blockSize + off, to[1] * blockSize + off);
        ctx.stroke();
    }
}
hilbert();
