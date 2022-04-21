import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from '../../input-text/input-text.module';
import { RichTextEditorModule } from '../../rich-text-editor/rich-text-editor.module';
import { EmailComponent } from './email.component';
import { ChipListModule } from '../../chip-list/chip-list.module';
import { By } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage-angular';
import {MatMenuModule} from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

describe('EmailComponent', () => {
  let component: EmailComponent;
  let fixture: ComponentFixture<EmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        InputTextModule,
        RichTextEditorModule,
        MatButtonModule,
        ChipListModule,
        MatIconModule,
        FormsModule,
        IonicStorageModule.forRoot(),
        MatMenuModule,
        MatDividerModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable send button when any of the value is not present', () => {
    fixture.whenStable().then(() => {
      const sendBtn = fixture.debugElement.query(By.css('#send-email-btn')).nativeElement as HTMLButtonElement;
      expect(sendBtn.disabled).toBeTruthy();  
    });
  })

  it('should enable send button when any of the value is present', () => {
    component.initialValue = {
      toAdresses: ['test@gmail.com'],
      subject: 'testing',
      body: {
        content: 'test mail'
      }
    }
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const sendBtn = fixture.debugElement.query(By.css('#send-email-btn')).nativeElement as HTMLButtonElement;
      expect(sendBtn.disabled).toBeFalsy();  
    });
  })

  it('should emit email value whenever send button is clicked', fakeAsync( () => {
    component.initialValue = {
      toAdresses: ['test@gmail.com'],
      subject: 'testing',
      body: {
        content: 'test mail'
      }
    }
    fixture.detectChanges();

    const spy = spyOn(component, 'sendEmail');

    fixture.whenStable().then(() => {
      const sendBtn = fixture.debugElement.query(By.css('#send-email-btn'));
      sendBtn.triggerEventHandler('click', null);

      tick();
      fixture.detectChanges();
    });

    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    })
  }));

  it('should emit cancel event with data as cancelled on click of cancel button', () => {
    const spy = spyOn(component, 'cancelSendingEmail');

    fixture.whenStable().then(() => {
      const sendBtn = fixture.debugElement.query(By.css('#cancel-email-btn'));
      sendBtn.triggerEventHandler('click', null);

      tick();
      fixture.detectChanges();
    });

    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    })
  })

});
