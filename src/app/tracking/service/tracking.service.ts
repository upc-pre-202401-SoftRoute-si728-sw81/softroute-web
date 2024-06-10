import { Injectable } from '@angular/core';
import {
  Client,
  Frame,
  Message,
  Stomp,
  StompSubscription,
} from '@stomp/stompjs';
import { Observable, Observer } from 'rxjs';
import SockJS from 'sockjs-client';
import { BaseService } from '../../shared/services/base.service';
import { Tracking } from '../model/tracking';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TrackingService extends BaseService<Tracking> {
  private subscription: StompSubscription | null = null;
  private connected: boolean = false;

  constructor(http: HttpClient) {
    super(http);

    this.resourceEndpoint = '/tracking';
    /*
    this.client = new Client({
      brokerURL: '',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => {
        return new SockJS('');
      },
    });

    this.connectionPromise = new Promise((resolve, reject) => {
      this.client.onConnect = (frame: Frame) => {
        console.log('Connected' + frame);
        this.connected = true;
        resolve();
      };

      this.client.onStompError = (frame: Frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        reject(frame);
      };

      this.client.activate();
    });
    */
  }
  /*
  public connect(): Promise<void> {
    return this.connectionPromise;
  }

  public subscribe(topic: string): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.subscription = this.client.subscribe(topic, (message: Message) => {
        observer.next(JSON.parse(message.body));
      });

      return () => {
        if (this.subscription) this.subscription.unsubscribe();
      };
    });
  }
    */
}
