import { Tag } from './tag';

export class TagGroup {
    tagGroupName: string;
    colour: string;
    tagGroupId: string;
    limitToOne: boolean;
    displayGroupName: boolean;
    public: boolean;
    publish: boolean;
    childNodesInherit: boolean;
    tags: Tag[];

    constructor() {
    }
}
