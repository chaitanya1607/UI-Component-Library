import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RichTextEditorComponent } from './rich-text-editor.component';

describe('RichTextEditorComponent', () => {
  let component: RichTextEditorComponent;
  let fixture: ComponentFixture<RichTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RichTextEditorComponent],
      imports: [
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RichTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a div with attribute contnteditable', () => {
    fixture.whenStable().then(() => {
      const divElement = fixture.debugElement.query(By.css('.rich-editor'))
        .nativeElement as HTMLDivElement;
      expect(divElement.hasAttribute('contenteditable')).toBe(true);
    });
  });

  it('should add space when tab is clicked', () => {
    let divElement: HTMLDivElement;

    fixture.whenStable().then(() => {
      divElement = fixture.debugElement.query(By.css('.rich-editor'))
        .nativeElement as HTMLDivElement;

      divElement.textContent = 'Hello';
      fixture.detectChanges();
    });

    fixture.whenStable().then(() => {
      const range = document.createRange();
      const sel = window.getSelection();

      range.setStart(divElement, 1);
      range.collapse(true);

      sel.removeAllRanges();
      sel.addRange(range);

      const tabKeypress = new KeyboardEvent('keydown', {
        key: 'Tab',
      });

      divElement.dispatchEvent(tabKeypress);
    });

    fixture.whenStable().then(() => {
      const sele = window.getSelection();
      if (!sele?.rangeCount) return;
      const rag = sele.getRangeAt(0);

      expect(rag.startOffset).toBe(2);

      expect(/\t/.test(divElement.textContent)).toBe(true);
    });
  });
});
