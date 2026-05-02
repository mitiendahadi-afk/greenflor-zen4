export function playOrderSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx()
    const compressor = ctx.createDynamicsCompressor()
    compressor.connect(ctx.destination)

    const notes = [
      { freq: 523.25, time: 0,    dur: 0.12, vol: 0.8 },
      { freq: 659.25, time: 0.12, dur: 0.12, vol: 0.8 },
      { freq: 783.99, time: 0.24, dur: 0.12, vol: 0.8 },
      { freq: 1046.5, time: 0.36, dur: 0.25, vol: 1.0 },
      { freq: 1318.5, time: 0.61, dur: 0.40, vol: 1.0 },
    ]

    notes.forEach(n => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(compressor)
      osc.frequency.value = n.freq
      osc.type = 'sine'
      gain.gain.setValueAtTime(n.vol, ctx.currentTime + n.time)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur)
      osc.start(ctx.currentTime + n.time)
      osc.stop(ctx.currentTime + n.time + n.dur + 0.1)
    })
  } catch (e) {
    console.log('[Sound] Audio not available:', e)
  }
}
