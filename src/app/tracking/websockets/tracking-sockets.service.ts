import { Injectable, OnDestroy } from '@angular/core';
import { Client, Frame, Message, StompSubscription } from '@stomp/stompjs';
import { Observable, Observer, Subject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class TrackingSocketsService implements OnDestroy {
  private client: Client;
  private subscription: StompSubscription | null = null;
  private connectionPromise: Promise<void> | null = null;
  private connected = false;
  private disconnectSubject = new Subject<void>();

  constructor() {
    this.client = new Client({
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => {
        return new SockJS('http://34.23.72.178:8080/ws');
      },
    });
  }

  init(): void {
    if (this.connectionPromise) {
      // Ya se ha inicializado
      return;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.client.onConnect = (frame: Frame) => {
        console.log('Connected: ' + frame);
        this.connected = true;
        resolve();
      };

      this.client.onStompError = (frame: Frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        this.connected = false;
        reject(frame);
      };

      this.client.onWebSocketClose = (event) => {
        console.error('WebSocket closed', event);
        this.connected = false;
      };

      this.client.onWebSocketError = (event) => {
        console.error('WebSocket error', event);
        this.connected = false;
        reject(event);
      };

      this.client.activate();
    });
  }

  public async connect(): Promise<void> {
    if (this.connected) {
      return Promise.resolve();
    }
    if (!this.connectionPromise) {
      this.init();
    }
    return this.connectionPromise!;
  }

  public subscribe(topic: string): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.connect()
        .then(() => {
          if (!this.connected) {
            observer.error('Not connected to WebSocket');
            return;
          }

          this.subscription = this.client.subscribe(
            topic,
            (message: Message) => {
              observer.next(JSON.parse(message.body));
            }
          );

          return () => {
            if (this.subscription) this.subscription.unsubscribe();
          };
        })
        .catch((error) => {
          observer.error('Subscription failed due to connection error');
        });
    });
  }

  public disconnect(): void {
    if (this.client && this.connected) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
