import { LensConfig } from "../types";
import * as defaults from "../config";

export default function Footer({ config }: { config: LensConfig }) {
  return (
    <div className="mt-auto flex justify-center text-sm">
      <div className="mt-20 mb-3">
        <a
          target="_blank"
          href={defaults.repoURL}
          className="text-center opacity-50 link-hover hover:link-primary hover:cursor-pointer"
        >
          Lens version {config?.lens_version}
        </a>
      </div>
    </div>
  );
}
