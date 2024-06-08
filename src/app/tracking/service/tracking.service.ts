import { Injectable } from '@angular/core';
import { Client, Frame, Message, StompSubscription } from '@stomp/stompjs';
import { Observable, Observer } from 'rxjs';
import SockJS from 'sockjs-client';
import { Tracking } from '../model/tracking';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private client: Client;
  private subscription: StompSubscription | null = null;
  private connected: boolean = false;
  private connectionPromise: Promise<void>;
  private retryLimit: number = 3;
  private retryCount: number = 0;

  constructor() {
    this.client = new Client({
      brokerURL: "",
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => {
        return new SockJS("");
      }
    });

    this.connectionPromise = new Promise((resolve, reject) => {
      this.client.beforeConnect = () => {
        if (this.client.brokerURL === '') {
          console.log("No brokerURL");
          this.client.deactivate();
        }
      };

      this.client.onConnect = (frame: Frame) => {
        console.log("Connected" + frame);
        this.connected = true;
        resolve();
      };

      this.client.onStompError = (frame: Frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        reject(frame);
      };

      this.client.onWebSocketClose = (closeEvent: CloseEvent) => {
        console.log('WebSocket connection closed with code:', closeEvent.code);

        if (closeEvent.code !== 1000) {
          if (this.retryCount >= this.retryLimit) {
            console.error('Exceeded retry limit. Subscription failed.');
            this.client.deactivate();
          }
          this.retryCount++;

          console.log('Attempting to reconnect...', this.retryCount);
        }
      };

      this.client.activate();
    });
  }

  public connect(): Promise<void> {
    return this.connectionPromise;
  };

  public subscribe(topic: string): Observable<Tracking> {
    return new Observable((observer: Observer<Tracking>) => {
      this.subscription = this.client.subscribe(topic, (message: Message) => {
        observer.next(JSON.parse(message.body));
      });

      return () => {
        if (this.subscription) this.subscription.unsubscribe();
      };
    });
  };
}

