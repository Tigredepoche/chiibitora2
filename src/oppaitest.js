const path = require('path');
const util = require('util');
const oppai = require('oppai');

function main()
{
    process.argv.splice(0, 1);

    if (process.argv.length != 2)
    {
        console.error("Usage: " + process.argv[0] + " file.osu");
        process.exit(1);
    }

    var script_path = path.dirname(process.argv[0]);

    // if you need to multithread, create one ctx and buffer for each thread
    var ctx = oppai.Ctx();

    // parse beatmap -----------------------------------------------------------
    var b = oppai.Beatmap(ctx);

    const BUFSIZE = 2000000; // should be big enough to hold the .osu file
    var buf = oppai.Buffer(BUFSIZE);

    b.parse(
        process.argv[1],
        buf,
        BUFSIZE,

        // don't disable caching and use js script's folder for caching
        false,
        script_path
    );

    console.log("Cache folder: " + script_path + "\n");

    console.log(
        util.format(
            "%s - %s [%s] (by %s)\n" +
            "CS%d OD%d AR%d HP%d\n" +
            "%d objects (%d circles, %d sliders, %d spinners)\n" +
            "max combo: %d",
            b.artist(), b.title(), b.version(), b.creator(),
            b.cs().toPrecision(2), b.od().toPrecision(2),
            b.ar().toPrecision(2), b.hp().toPrecision(2),
            b.numObjects(), b.numCircles(), b.numSliders(), b.numSpinners(),
            b.maxCombo()
        )
    );

    // diff calc ---------------------------------------------------------------
    dctx = oppai.DiffCalcCtx(ctx);
    diff = dctx.diffCalc(b);

    console.log(
        util.format(
            "\n%d stars\n%d aim stars\n%d speed stars",
            diff.stars, diff.aim, diff.speed
        )
    )

    // pp calc -----------------------------------------------------------------
    res = ctx.ppCalc(diff.aim, diff.speed, b);

    console.log(
        util.format(
            "\n%d aim\n%d speed\n%d acc\n%d pp\nfor %d%%",
            res.aimPp, res.speedPp, res.accPp, res.pp, res.accPercent
        )
    );
}

main();