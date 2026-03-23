import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChatWidgedComponent } from './chat-widged.component';

describe('ChatWidgedComponent', () => {
  let component: ChatWidgedComponent;
  let fixture: ComponentFixture<ChatWidgedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ChatWidgedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatWidgedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
