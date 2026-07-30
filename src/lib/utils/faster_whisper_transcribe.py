#!/usr/bin/env python3
import argparse
import json
from faster_whisper import WhisperModel


def main():
    parser = argparse.ArgumentParser(description="Transcribe audio with faster-whisper")
    parser.add_argument("--audio", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--model", default="large-v3")
    parser.add_argument("--device", default="cpu")
    parser.add_argument("--compute-type", default="int8")
    args = parser.parse_args()

    model = WhisperModel(args.model, device=args.device, compute_type=args.compute_type)
    segments, info = model.transcribe(args.audio, beam_size=5)

    segment_list = []
    raw_parts = []

    for seg in segments:
        text = seg.text.strip()
        segment_list.append(
            {
                "start": seg.start,
                "end": seg.end,
                "text": text,
                "confidence": getattr(seg, "avg_logprob", 0.0),
            }
        )
        raw_parts.append(text)

    result = {
        "language": info.language,
        "language_probability": info.language_probability,
        "segments": segment_list,
        "raw": " ".join(raw_parts),
    }

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False)


if __name__ == "__main__":
    main()
