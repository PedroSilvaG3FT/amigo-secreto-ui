import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'amigo-secreto-ui';

  public isTroll: boolean = false;
  public friendName: string = ``;
  public errorMessage: string = ``;
  public participantName: string = ``;
  public readonly storageKey: string = `@amigo-secreto:participantName`;
  public encriptedDrawer: string = `W3sicGVyc29uIjoiSXZvbmUiLCJmcmllbmQiOiJOaXRvIn0seyJwZXJzb24iOiJOaXRvIiwiZnJpZW5kIjoiTmV1bWEifSx7InBlcnNvbiI6Ik5ldW1hIiwiZnJpZW5kIjoiSWdvciJ9LHsicGVyc29uIjoiSWdvciIsImZyaWVuZCI6IkVsYWluZSJ9LHsicGVyc29uIjoiRWxhaW5lIiwiZnJpZW5kIjoiQW5hbGljZSJ9LHsicGVyc29uIjoiQW5hbGljZSIsImZyaWVuZCI6Ikp1bmluaG8ifSx7InBlcnNvbiI6Ikp1bmluaG8iLCJmcmllbmQiOiJQZWRybyJ9LHsicGVyc29uIjoiUGVkcm8iLCJmcmllbmQiOiJFZGlzb24ifSx7InBlcnNvbiI6IkVkaXNvbiIsImZyaWVuZCI6IkNhcm9sIn0seyJwZXJzb24iOiJDYXJvbCIsImZyaWVuZCI6IkdpbGJlcnRvIn0seyJwZXJzb24iOiJHaWxiZXJ0byIsImZyaWVuZCI6IkdhYnJpZWwifSx7InBlcnNvbiI6IkdhYnJpZWwiLCJmcmllbmQiOiJEYXZpIn0seyJwZXJzb24iOiJEYXZpIiwiZnJpZW5kIjoiQ2FyaW5hIn0seyJwZXJzb24iOiJDYXJpbmEiLCJmcmllbmQiOiJBbmEgQ2xhcmEifSx7InBlcnNvbiI6IkFuYSBDbGFyYSIsImZyaWVuZCI6IkxldnkifSx7InBlcnNvbiI6IkxldnkiLCJmcmllbmQiOiJJdm9uZSJ9XQ==`;
  public participantNameStore = localStorage.getItem(this.storageKey);
  public participants: string[] = [
    'Igor',
    'Carol',
    'Ivone',
    'Gilberto',
    'Carina',
    'Pedro',
    'Elaine',
    'Edison',
    'Davi',
    'Analice',
    'Gabriel',
    'Neuma',
    'Nito',
    'Levy',
    'Ana Clara',
    'Juninho',
  ];

  ngOnInit() {
    this.initDrawer();
  }

  public initDrawer() {
    const data = [];
    const result = this.drawer(this.participants);

    if (result === null) {
      console.log('Deu ruim');
      return;
    }

    for (const [person, friend] of Object.entries(result)) {
      data.push({ person, friend });
    }

    const base64Data = this.arrayToBase64(data);
    const array64Data = this.base64ToArray(base64Data);

    console.log(`BASE 64 : `, base64Data);
  }

  public base64ToArray(base64String: string): object[] {
    const jsonString = atob(base64String);
    const arrayData = JSON.parse(jsonString);
    return arrayData;
  }

  public arrayToBase64(array: object[]): string {
    const jsonString = JSON.stringify(array);
    const base64String = btoa(jsonString);
    return base64String;
  }

  public shuffleArray(array: string[]): string[] {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  public drawer(participants: string[]): { [key: string]: string } | null {
    const shuffledParticipants = this.shuffleArray(participants);
    const pairs: { [key: string]: string } = {};

    for (let i = 0; i < shuffledParticipants.length; i++) {
      const currentParticipant = shuffledParticipants[i];
      const nextIndex = (i + 1) % shuffledParticipants.length;
      const nextParticipant = shuffledParticipants[nextIndex];

      if (currentParticipant === nextParticipant) return null;

      pairs[currentParticipant] = nextParticipant;
    }

    return pairs;
  }

  public showSecretFriend() {
    this.isTroll = false;
    this.friendName = '';
    this.errorMessage = '';

    const storageName = localStorage.getItem(this.storageKey);

    const descriptedList: ISecretFriendItem[] = this.base64ToArray(
      this.encriptedDrawer
    ) as ISecretFriendItem[];

    const friendItem = descriptedList.find(
      ({ person }) => person === this.participantName
    );

    if (friendItem) {
      if (!!storageName && this.participantName !== storageName) {
        this.isTroll = true;
        return;
      } else {
        this.friendName = friendItem.friend;
        localStorage.setItem(this.storageKey, this.participantName);
      }
    } else {
      this.participantName = '';
      this.errorMessage =
        'Não encontrei o seu nome na lista, preencha o nome correto';
    }
  }
}

export interface ISecretFriendItem {
  person: string;
  friend: string;
}
