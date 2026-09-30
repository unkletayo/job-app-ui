import { EntrySection } from "@/components/entry-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  achievementConfig,
  certificationConfig,
  educationConfig,
  experienceConfig,
  linkConfig,
  projectConfig,
  skillConfig,
} from "@/lib/entry-config"

export function ProfileEntryTabs() {
  return (
    <Tabs defaultValue="experience" className="gap-4">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="links">Links</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
      </TabsList>
      <TabsContent value="experience">
        <EntrySection config={experienceConfig} />
      </TabsContent>
      <TabsContent value="education">
        <EntrySection config={educationConfig} />
      </TabsContent>
      <TabsContent value="certifications">
        <EntrySection config={certificationConfig} />
      </TabsContent>
      <TabsContent value="skills">
        <EntrySection config={skillConfig} />
      </TabsContent>
      <TabsContent value="projects">
        <EntrySection config={projectConfig} />
      </TabsContent>
      <TabsContent value="links">
        <EntrySection config={linkConfig} />
      </TabsContent>
      <TabsContent value="achievements">
        <EntrySection config={achievementConfig} />
      </TabsContent>
    </Tabs>
  )
}
