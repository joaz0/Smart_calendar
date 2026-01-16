import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms.component';

@Component({
  standalone: true,
  selector: 'app-scheduling-poll-creator',
  imports: [FormsModule],
  templateUrl: './scheduling-poll-creator.html',
  styleUrl: './scheduling-poll-creator.scss'
})
export class SchedulingPollCreatorComponent {
  poll = { title: '', duration: 30, timeSlots: [{ date: '', start: '', end: '' }] };
  createdPollId: string | null = null;

  createPoll() {
    this.createdPollId = 'poll-' + Date.now();
  }

  addSlot() {
    this.poll.timeSlots.push({ date: '', start: '', end: '' });
  }

  removeSlot(index: number) {
    this.poll.timeSlots.splice(index, 1);
  }

  getPollLink() {
    return `${window.location.origin}/poll/${this.createdPollId}`;
  }

  copyLink() {
    navigator.clipboard.writeText(this.getPollLink());
  }
}
