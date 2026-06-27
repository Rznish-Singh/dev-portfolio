"use client";

import { PROJECTS } from "@/config/projects";
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "@/components/ui/panel";
import { CollapsibleList } from "@/components/ui/collapsible-list";
import { ProjectItem } from "./project-item";

export function Projects() {
  return (
    <Panel id="projects" className="space-y-4">
      <PanelHeader>
        <PanelTitle>
          Projects
          <PanelTitleSup>({PROJECTS.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={PROJECTS}
        max={4}
        renderItem={(item, isFirst, isLast) => (
          <ProjectItem project={item} isFirst={isFirst} isLast={isLast} />
        )}
      />
    </Panel>
  );
}
