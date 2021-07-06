import { FirstOrderStudioComponent } from './studio-component';

export type StudioApp = {
  versionId: string;
  shareableId: string;
  studioConfig: StudioConfig;
};

export type StudioConfig = {
  name: string;
  components: FirstOrderStudioComponent[];
};
