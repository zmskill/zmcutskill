#!/usr/bin/env bash
# 下载离线中文 ASR（sherpa-onnx + SenseVoice int8 + Silero VAD），下载约 670 MB，装好占约 2.1 GB 硬盘。
# 运行前先问用户（要下载）。听写固定用它，不改用 AI 自带的转写：别的给不出可靠的逐字时间。
# 断了重跑会接着下（curl -C -）。单条命令有时长上限的环境里，被打断就再跑一次；不要放后台，有些环境命令一结束后台进程就被停掉。
set -euo pipefail
DIR="${VK_ASR_DIR:-$HOME/.cache/zm-talk-visual/asr}"
VER="${SHERPA_VERSION:-v1.13.8}"
MODEL="sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17"
mkdir -p "$DIR" && cd "$DIR"
OS="$(uname -s)"; ARCH="$(uname -m)"
case "$OS-$ARCH" in
  Linux-x86_64) PKG="sherpa-onnx-$VER-linux-x64-static" ;;
  Linux-aarch64) PKG="sherpa-onnx-$VER-linux-aarch64-static" ;;
  Darwin-*) PKG="sherpa-onnx-$VER-osx-universal2-static" ;;
  *) echo "不支持的平台 $OS-$ARCH"; exit 2 ;;
esac
BASE="https://github.com/k2-fsa/sherpa-onnx/releases/download"
get() { for i in 1 2 3 4 5; do curl -fSL --retry 3 -C - -o "$1" "$2" && return 0; echo "下载中断，第 $i 次重试…"; sleep 3; done; return 1; }
unpack() { rm -rf .x && mkdir .x && tar xjf "$1" -C .x && mv .x/"$2" . && rm -rf .x "$1"; }   # 先解到临时目录，解完再挪过去：中途断了不会留下半个目录
[ -d "$PKG" ] || { get "$PKG.tar.bz2" "$BASE/$VER/$PKG.tar.bz2" && unpack "$PKG.tar.bz2" "$PKG"; }
[ -d "$MODEL" ] || { get "$MODEL.tar.bz2" "$BASE/asr-models/$MODEL.tar.bz2" && unpack "$MODEL.tar.bz2" "$MODEL"; }
[ -f silero_vad.onnx ] || get silero_vad.onnx "$BASE/asr-models/silero_vad.onnx"
ln -sfn "$PKG" runtime
echo "ASR ready: $DIR"
