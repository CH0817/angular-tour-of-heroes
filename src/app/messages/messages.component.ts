import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  // inject MessageService，並設置為 public，因為在 template 中會用到 MessageService
  constructor(public messageService: MessageService) {}

  ngOnInit(): void {}
}
