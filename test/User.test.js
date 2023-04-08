import {User} from '../js/lib/User'
import {expect, jest} from '@jest/globals';

test('user test', ()=>{
    let user = new User("name", "email@")
    expect(user.getName()).toBe("name");
    user.setName("2")
    expect(user.getName()).toBe("2");

    expect(user.getEmail()).toBe("email@");
    user.setEmail("2@")
    expect(user.getEmail()).toBe("2@");

    user.setPassword(321)
    expect(user.getPassword()).toBe(321);

    user.getId();
})
