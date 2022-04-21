import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '../../core/value-accessor-base';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RichTextEditorComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextEditorComponent
  extends ValueAccessorBase
  implements OnInit {
  /**
   * @description initialValue for the editor
   */
  @Input() initialValue: string;

  /**
   * @description height of the editor
   */
  @Input() height: string;

  /**
   * @description label for the editor
   */
  @Input() label: string;

  /**
   * @description emits the editor content
   */
  @Output() editorContent: EventEmitter<string>;

  constructor(injector: Injector, cd: ChangeDetectorRef) {
    super(injector, cd);
    this.editorContent = new EventEmitter<string>();
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.initialValue) {
      this.value = this.initialValue;
    }
  }

  /**
   * checks whether the editor has focus or not
   * @returns boolean
   */
  doesEditorHasFocus() {
    const editorElement = document.querySelector('.rich-editor:focus');
    return !!editorElement;
  }

  /**
   * Formats the editor value based on the key pressed
   * @param event Keyboardevent
   */
  public onKeyDown(event: KeyboardEvent): void {
    if (event.shiftKey && event.key === 'Tab') {
      //shift was down when tab was pressed
      event.preventDefault();
      // Not implemented
    }

    if (!event.shiftKey && event.key === 'Tab') {
      event.preventDefault();
      this._addTabSpace();
    }
  }

  /**
   * Updates the form value with the editor content.
   * And emits the editor content.
   */
  public updateContent() {
    if (this.onTouchedFn) {
      this.onTouchedFn();
    }
    this.value = document.querySelector('[contenteditable]').innerHTML;
    this.editorContent.emit(this.value);
  }

  mouseOver() {
    const div = document.getElementById('editor-content');
    div.classList.add('rich-editor-hover');
  }

  mouseOut() {
    const div = document.getElementById('editor-content');
    div.classList.remove('rich-editor-hover');
  }

  // <------------------------Private methods------------------------------->

  /**
   * Creates a span elemnet with text as tab space
   * @returns the span elemnet
   */
  private _getSpanELement(): HTMLSpanElement {
    const span = document.createElement('span');
    span.appendChild(document.createTextNode('\t'));
    span.style.whiteSpace = 'pre';
    span.style.display = 'inline-block';

    return span;
  }

  /**
   * Adds tab space whenever the tab key is pressed
   */
  private _addTabSpace(): void {
    // gets the caret position
    if (!window.getSelection) return;
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.collapse(true);

    const span = this._getSpanELement();
    range.insertNode(span);

    // Move the caret immediately after the inserted span
    range.setStartAfter(span);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
