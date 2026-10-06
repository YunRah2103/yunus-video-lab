# Agent E native benchmark trigger

Purpose: run the locked 30-frame native 1080x1920 benchmark against the current YUNEX 002 integrated scene after the render validator and mux QA utilities are present.

QA rerun: FFmpeg probe + memory capture + artifact upload enabled.

Final QA rerun: explicit Remotion --pixel-format=yuv420p lock.
