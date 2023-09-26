import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  hubUrl: string;
  connection: any;

  constructor() {
    this.hubUrl = 'https://192.168.188.99:45456/signalrdemohub';
  }

  public async initiateSignalrConnection(): Promise<void> {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl)
        .withAutomaticReconnect()
        .build();

      await this.connection.start({ withCredentials: false });

      console.log(
        `SignalR connection success! connectionId: ${this.connection.connectionId}`
      );
    } catch (error) {
      console.log(`SignalR connection error: ${error}`);
    }
  }
  ////Offer
  public async setOfferCandidates(offerCandidates: string): Promise<void> {
    try {
      await this.connection.invoke('SetOfferCandidates', offerCandidates);
    } catch (error) {
      console.log(`Error sending signal: ${error}`);
    }
  }

  public async setOffer(offer: string): Promise<void> {
    try {
      await this.connection.invoke('SetOffer', offer);
    } catch (error) {
      console.log(`Error sending signal: ${error}`);
    }
  }

  public async getOffer(): Promise<string> {
    try {
      const offer = await this.connection.invoke('GetOffer');
      return offer;
    } catch (error) {
      console.error('Error getting offer: ' + error);
      return 'Error';
    }
  }

  ////Answer
  public async setAnswerCandidates(answerCandidates: string): Promise<void> {
    try {
      await this.connection.invoke('SetAnswerCandidates', answerCandidates);
    } catch (error) {
      console.log(`Error sending signal: ${error}`);
    }
  }

  public async setAnswer(answer: string): Promise<void> {
    try {
      await this.connection.invoke('SetAnswer', answer);
    } catch (error) {
      console.log(`Error sending signal: ${error}`);
    }
  }
}
