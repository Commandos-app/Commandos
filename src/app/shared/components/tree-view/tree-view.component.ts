import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'commander-tree-view',
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit {

    @Input() treeData!: any[];
    @Input() itemTemplate!: any;

    constructor() { }

    ngOnInit(): void {
    }


}
