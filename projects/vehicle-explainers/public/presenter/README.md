# Presenter assets

The current Porsche V3 presenter uses the committed `rework/poses.png` and `rework/heads.png` atlases. Their production consumer is `src/components/PacketGuyRework.tsx`; pose viewports, frame placement and isolated art boundaries are authored there. See `docs/PACKET_GUY_REWORK.md`.

Run `python scripts/prepare_assets.py` to create/copy the historical V1 transparent PNG pose pack into this directory for the legacy composition. That generator does not define current V3 artwork.

The identity source of truth remains `projects/stickman-studio/character/CHARACTER_SPEC.md`.
