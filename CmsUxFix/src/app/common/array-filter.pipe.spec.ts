import { ArrayFilterPipe } from './array-filter.pipe';
import { TestBed, inject } from '@angular/core/testing';

describe('CustomfilterPipe', () => {
    let pipe: ArrayFilterPipe;
    beforeEach(() => { pipe = new ArrayFilterPipe(); });

    it('array pipe is created', () => {
        expect(pipe).toBeTruthy();
    });

    it('Passing an array, field name and value it should return expected value', () => {
        const input = [
            { id: 1, Name: 'abc1' },
            { id: 2, Name: 'abc2' },
            { id: 3, Name: 'abc3' },
            { id: 4, Name: 'abc4' },
            { id: 5, Name: 'abc5' },
            { id: 6, Name: 'abc6' }
        ];
        const output = [{ id: 1, Name: 'abc1' }];
        const inputValue = 'abc1';
        const fieldName = 'Name';
        expect(pipe.transform(input, fieldName, inputValue)).toEqual(output);
    });

    it('Passing an array, field name and wrong value it should return empty array', () => {
        const input = [
            { id: 1, Name: 'abc1' },
            { id: 2, Name: 'abc2' },
            { id: 3, Name: 'abc3' },
            { id: 4, Name: 'abc4' },
            { id: 5, Name: 'abc5' },
            { id: 6, Name: 'abc6' }
        ];
        const output = [];
        const inputValue = 'abc12';
        const fieldName = 'Name';
        expect(pipe.transform(input, fieldName, inputValue)).toEqual(output);
    });

    it('Passing an blank array, field name and wrong value it should return empty array', () => {
        const input = [];
        const output = [];
        const inputValue = 'abc12';
        const fieldName = 'Name';
        expect(pipe.transform(input, fieldName, inputValue)).toEqual(output);
    });

    it('Passing an undefined, field name and wrong value it should return undefined ', () => {
        const input = undefined;
        const output = undefined;
        const inputValue = 'abc12';
        const fieldName = 'Name';
        expect(pipe.transform(input, fieldName, inputValue)).toEqual(output);
    });

    it('Passing an array, undefined field name and wrong value it should return input array', () => {
        const input = [
            { id: 1, Name: 'abc1' },
            { id: 2, Name: 'abc2' }
        ];
        const output = input;
        const inputValue = 'abc12';
        const fieldName = undefined;
        expect(pipe.transform(input, fieldName, inputValue)).toEqual(output);
    });

    it('Passing an array, field name and undefined imput value it should return input array', () => {
        const input = [
            { id: 1, Name: 'abc1' },
            { id: 2, Name: 'abc2' }
        ];
        const output = input;
        const inputValue = undefined;
        const fieldName = 'Name';
        expect(pipe.transform(input, fieldName, inputValue)).toEqual(output);
    });

    it('Passing an array, undefined field name and undefined imput value it should return input array', () => {
        const input = [
            { id: 1, Name: 'abc1' },
            { id: 2, Name: 'abc2' }
        ];
        const output = input;
        const inputValue = undefined;
        const fieldName = undefined;
        expect(pipe.transform(input, fieldName, inputValue)).toEqual(output);
    });

});
