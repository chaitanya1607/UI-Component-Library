import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxGroupComponent } from './checkbox-group.component';
import { CheckboxGroup, CheckboxGroupChange } from '../check-box.model';
import { By } from '@angular/platform-browser';

describe('CheckboxGroupComponent', () => {
  let component: CheckboxGroupComponent;
  let fixture: ComponentFixture<CheckboxGroupComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [CheckboxGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxGroupComponent);

    component = fixture.componentInstance;
    component.checkboxGroup = checkBoxGroup;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  });

  it('should call onBlur', () => {
    component.onBlur();
    expect(component.onBlur).toBeTruthy();
  });

  it('should update component.allCheckboxesChecked, someCheckboxesChecked and emit checkboxGroupChange with updated checkboxGroup when all items are unchecked', () => {
    spyOn(component.change, 'emit');
    component.checkboxGroup = checkBoxGroupAllItemsUnChecked;

    component.updateSelectAllChecked();

    expect(component.allCheckboxesChecked).toBe(false);
    expect(component.selectAllIndeterminate).toBe(false);
    let checkboxGroupChange: CheckboxGroupChange = new CheckboxGroupChange();
    checkboxGroupChange.checkBoxGroup = component.checkboxGroup;
    expect(component.change.emit).toHaveBeenCalledWith(checkboxGroupChange);
  });

  it('should update component.allCheckboxesChecked, someCheckboxesChecked and emit checkboxGroupChange with updated checkboxGroup when all items are checked', () => {
    spyOn(component.change, 'emit');
    component.checkboxGroup = checkBoxGroupAllItemsChecked;

    component.updateSelectAllChecked();

    expect(component.allCheckboxesChecked).toBe(true);
    expect(component.selectAllIndeterminate).toBe(false);
    let checkboxGroupChange: CheckboxGroupChange = new CheckboxGroupChange();
    checkboxGroupChange.checkBoxGroup = component.checkboxGroup;
    expect(component.change.emit).toHaveBeenCalledWith(checkboxGroupChange);
  });

  it('should update component.allCheckboxesChecked, someCheckboxesChecked and emit checkboxGroupChange with updated checkboxGroup when some items are checked', () => {
    spyOn(component.change, 'emit');
    component.checkboxGroup = checkBoxGroupSomeItemsChecked;

    component.updateSelectAllChecked();

    expect(component.allCheckboxesChecked).toBe(false);
    expect(component.selectAllIndeterminate).toBe(true);
    let checkboxGroupChange: CheckboxGroupChange = new CheckboxGroupChange();
    checkboxGroupChange.checkBoxGroup = component.checkboxGroup;
    expect(component.change.emit).toHaveBeenCalledWith(checkboxGroupChange);
  });

  it('should call selectAll with checked as true with all items unchecked and update component.allCheckboxesChecked, someCheckboxesChecked and emit checkboxGroupChange with updated checkboxGroup', () => {
    spyOn(component.change, 'emit');
    component.checkboxGroup = checkBoxGroupAllItemsUnChecked;
    let checked: boolean = true;
    component.selectAll(checked);

    expect(component.allCheckboxesChecked).toBe(true);
    component.checkboxGroup.items.forEach((item) =>
      expect(item.checked).toBe(true)
    );
    expect(component.selectAllIndeterminate).toBe(false);

    let checkboxGroupChange: CheckboxGroupChange = new CheckboxGroupChange();
    checkboxGroupChange.checkBoxGroup = component.checkboxGroup;
    expect(component.change.emit).toHaveBeenCalledWith(checkboxGroupChange);
  });

  it('should call selectAll with checked as true with all items checked update component.allCheckboxesChecked, someCheckboxesChecked and emit checkboxGroupChange with updated checkboxGroup', () => {
    spyOn(component.change, 'emit');
    component.checkboxGroup = checkBoxGroupAllItemsChecked;
    let checked: boolean = true;
    component.selectAll(checked);

    expect(component.allCheckboxesChecked).toBe(true);
    component.checkboxGroup.items.forEach((item) =>
      expect(item.checked).toBe(true)
    );
    expect(component.selectAllIndeterminate).toBe(false);

    let checkboxGroupChange: CheckboxGroupChange = new CheckboxGroupChange();
    checkboxGroupChange.checkBoxGroup = component.checkboxGroup;
    expect(component.change.emit).toHaveBeenCalledWith(checkboxGroupChange);
  });

  it('should call selectAll with checked as true with some items checked update component.allCheckboxesChecked, someCheckboxesChecked and emit checkboxGroupChange with updated checkboxGroup', () => {
    spyOn(component.change, 'emit');
    component.checkboxGroup = checkBoxGroupSomeItemsChecked;
    let checked: boolean = true;
    component.selectAll(checked);

    expect(component.allCheckboxesChecked).toBe(true);
    component.checkboxGroup.items.forEach((item) =>
      expect(item.checked).toBe(true)
    );
    expect(component.selectAllIndeterminate).toBe(false);

    let checkboxGroupChange: CheckboxGroupChange = new CheckboxGroupChange();
    checkboxGroupChange.checkBoxGroup = component.checkboxGroup;
    expect(component.change.emit).toHaveBeenCalledWith(checkboxGroupChange);
  });

  it('should call selectAll with checked as false with all items unchecked update component.allCheckboxesChecked, someCheckboxesChecked and emit checkboxGroupChange with updated checkboxGroup', () => {
    spyOn(component.change, 'emit');
    component.checkboxGroup = checkBoxGroupAllItemsUnChecked;
    let checked: boolean = false;
    component.selectAll(checked);

    expect(component.allCheckboxesChecked).toBe(false);
    component.checkboxGroup.items.forEach((item) =>
      expect(item.checked).toBe(false)
    );
    expect(component.selectAllIndeterminate).toBe(false);

    let checkboxGroupChange: CheckboxGroupChange = new CheckboxGroupChange();
    checkboxGroupChange.checkBoxGroup = component.checkboxGroup;
    expect(component.change.emit).toHaveBeenCalledWith(checkboxGroupChange);
  });

  it('should call selectAll with checked as false with all items checked update component.allCheckboxesChecked, someCheckboxesChecked and emit checkboxGroupChange with updated checkboxGroup', () => {
    spyOn(component.change, 'emit');
    component.checkboxGroup = checkBoxGroupAllItemsChecked;
    let checked: boolean = false;
    component.selectAll(checked);

    expect(component.allCheckboxesChecked).toBe(false);
    component.checkboxGroup.items.forEach((item) =>
      expect(item.checked).toBe(false)
    );
    expect(component.selectAllIndeterminate).toBe(false);

    let checkboxGroupChange: CheckboxGroupChange = new CheckboxGroupChange();
    checkboxGroupChange.checkBoxGroup = component.checkboxGroup;
    expect(component.change.emit).toHaveBeenCalledWith(checkboxGroupChange);
  });

  it('should call selectAll with checked as false with some items checked update component.allCheckboxesChecked, someCheckboxesChecked and emit checkboxGroupChange with updated checkboxGroup', () => {
    spyOn(component.change, 'emit');
    component.checkboxGroup = checkBoxGroupSomeItemsChecked;
    let checked: boolean = false;
    component.selectAll(checked);

    expect(component.allCheckboxesChecked).toBe(false);
    component.checkboxGroup.items.forEach((item) =>
      expect(item.checked).toBe(false)
    );
    expect(component.selectAllIndeterminate).toBe(false);

    let checkboxGroupChange: CheckboxGroupChange = new CheckboxGroupChange();
    checkboxGroupChange.checkBoxGroup = component.checkboxGroup;
    expect(component.change.emit).toHaveBeenCalledWith(checkboxGroupChange);
  });

  it('should bind value to the checkbox component', () => {
    component.value = 'value';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkbox = fixture.debugElement.query(By.css('mat-checkbox'))
        .nativeElement.value;
      expect(checkbox).toBe('value');
    });
  });

  it('should render title in a label tag', () => {
    component.label = 'Basic Checkbox Group';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const compiled = fixture.debugElement.nativeElement;
      expect(
        compiled.querySelector('.control-label label').textContent
      ).toContain('Basic Checkbox Group');
    });
  });

  it('should render Select All label', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const compiled = fixture.debugElement.nativeElement;
      expect(
        compiled.querySelector('.checkbox-group-all mat-checkbox').textContent
      ).toContain(checkBoxGroup.selectAll.name);
    });
  });

  it('should render checkbox names', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const compiled = fixture.debugElement.nativeElement;
      let checkBox = compiled.querySelectorAll(
        'li mat-checkbox'
      ) as NodeListOf<HTMLElement>;
      expect(checkBox.length).toEqual(checkBoxGroup.items.length);
      expect(checkBox[0].textContent.trim()).toEqual(
        checkBoxGroup.items[0].name
      );
      expect(checkBox[1].textContent.trim()).toEqual(
        checkBoxGroup.items[1].name
      );
      expect(checkBox[2].textContent.trim()).toEqual(
        checkBoxGroup.items[2].name
      );
    });
  });

  it('should add disabled true to the mat-checkbox element', () => {
    component.checkboxGroup = checkBoxGroup;
    component.checkboxGroup.selectAll.disabled = true;
    component.ngOnInit();
    component.checkboxGroup.items.forEach((item) =>
      expect(item.disabled).toBe(true)
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkboxDebugElement = fixture.debugElement.query(
        By.directive(MatCheckbox)
      );
      const checkboxInstance = checkboxDebugElement.componentInstance;
      expect(checkboxInstance.disabled).toBe(true);
    });
  });

  it('should add disabled false to the mat-checkbox element', () => {
    component.checkboxGroup = checkBoxGroup;
    component.checkboxGroup.selectAll.disabled = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkboxDebugElement = fixture.debugElement.query(
        By.directive(MatCheckbox)
      );
      const checkboxInstance = checkboxDebugElement.componentInstance;
      expect(checkboxInstance.disabled).toBe(false);
    });
  });

  it('should add checked true to the mat-checkbox element', () => {
    component.checkboxGroup = checkBoxGroupAllItemsChecked;
    component.checkboxGroup.selectAll.checked = true;

    component.selectAll(true);
    component.checkboxGroup.items.forEach((item) =>
      expect(item.checked).toBe(true)
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkboxDebugElement = fixture.debugElement.query(
        By.directive(MatCheckbox)
      );
      const checkboxInstance = checkboxDebugElement.componentInstance;
      expect(checkboxInstance.checked).toBe(true);
    });
  });

  it('should add checked false to the mat-checkbox element', () => {
    component.checkboxGroup = checkBoxGroup;
    component.checkboxGroup.selectAll.checked = false;
    component.selectAll(false);
    component.checkboxGroup.items.forEach((item) =>
      expect(item.checked).toBe(false)
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkboxDebugElement = fixture.debugElement.query(
        By.directive(MatCheckbox)
      );
      const checkboxInstance = checkboxDebugElement.componentInstance;
      expect(checkboxInstance.checked).toBe(false);
    });
  });

  it('should add indeterminate true to the mat-checkbox element', () => {
    component.selectAllIndeterminate = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkboxDebugElement = fixture.debugElement.query(
        By.directive(MatCheckbox)
      );
      const checkboxInstance = checkboxDebugElement.componentInstance;
      expect(checkboxInstance.indeterminate).toBe(true);
    });
  });

  it('should add indeterminate false to the mat-checkbox element', () => {
    component.selectAllIndeterminate = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkboxDebugElement = fixture.debugElement.query(
        By.directive(MatCheckbox)
      );
      const checkboxInstance = checkboxDebugElement.componentInstance;
      expect(checkboxInstance.indeterminate).toBe(false);
    });
  });

  it('should add label position to the mat-checkbox element', () => {
    component.labelPosition = 'after';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkboxDebugElement = fixture.debugElement.query(
        By.directive(MatCheckbox)
      );
      const checkboxInstance = checkboxDebugElement.componentInstance;
      expect(checkboxInstance.labelPosition).toContain('after');
      component.labelPosition = 'before';
      fixture.detectChanges();
      expect(checkboxInstance.labelPosition).toContain('before');
    });
  });

  it('should update the ngModel value when using the toggle method', () => {
    const selectAllcheckbox = fixture.debugElement.query(
      By.directive(MatCheckbox)
    ).componentInstance;
    selectAllcheckbox.toggle();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let expected = {
        checked: false,
        disabled: false,
        label: 'check boxes',
        name: 'select All',
      };
      expect(fixture.componentInstance.checkboxGroup.selectAll).toStrictEqual(
        expected
      );
    });
  });
});

const checkBoxGroup: CheckboxGroup = {
  selectAll: {
    name: 'select All',
    label: 'check boxes',
    checked: false,
    disabled: false,
  },
  items: [
    {
      name: 'check box 1',
      label: 'check boxes',
      checked: false,
      disabled: true,
    },
    {
      name: 'check box 2',
      label: 'check boxes',
      checked: false,
      disabled: false,
    },
    {
      name: 'check box 3',
      label: 'check boxes',
      checked: false,
      disabled: false,
    },
  ],
};

const checkBoxGroupAllItemsUnChecked: CheckboxGroup = {
  selectAll: {
    name: 'select All',
    label: 'check boxes',
    checked: false,
    disabled: false,
  },
  items: [
    {
      name: 'check box 1',
      label: 'check boxes',
      checked: false,
      disabled: true,
    },
    {
      name: 'check box 2',
      label: 'check boxes',
      checked: false,
      disabled: false,
    },
    {
      name: 'check box 3',
      label: 'check boxes',
      checked: false,
      disabled: false,
    },
  ],
};

const checkBoxGroupAllItemsChecked: CheckboxGroup = {
  selectAll: {
    name: 'select All',
    label: 'check boxes',
    checked: false,
    disabled: false,
  },
  items: [
    {
      name: 'check box 1',
      label: 'check boxes',
      checked: true,
      disabled: true,
    },
    {
      name: 'check box 2',
      label: 'check boxes',
      checked: true,
      disabled: false,
    },
    {
      name: 'check box 3',
      label: 'check boxes',
      checked: true,
      disabled: false,
    },
  ],
};

const checkBoxGroupSomeItemsChecked: CheckboxGroup = {
  selectAll: {
    name: 'select All',
    label: 'check boxes',
    checked: false,
    disabled: false,
  },
  items: [
    {
      name: 'check box 1',
      label: 'check boxes',
      checked: false,
      disabled: true,
    },
    {
      name: 'check box 2',
      label: 'check boxes',
      checked: true,
      disabled: false,
    },
    {
      name: 'check box 3',
      label: 'check boxes',
      checked: true,
      disabled: false,
    },
  ],
};
