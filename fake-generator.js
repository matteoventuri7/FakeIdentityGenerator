const $company = document.getElementById('company');
const $firstName = document.getElementById('firstName');
const $lastName = document.getElementById('lastName');
const $completeName = document.getElementById('completeName');
const $email = document.getElementById('email');
const $birthDate = document.getElementById('birthDate');
const $birthPlace = document.getElementById('birthPlace');
const $prov = document.getElementById('prov');
const $piva = document.getElementById('piva');
const $cf = document.getElementById('cf');
const $address = document.getElementById('address');
const $zip = document.getElementById('zip');

const pg = new ITVatGV();

document.getElementById('generate').addEventListener('click', ResetIdentityStored);
document.querySelectorAll('.copy-it').forEach((e) => e.addEventListener('click', Copy));

function ResetIdentityStored() {
    localStorage.removeItem('fakeIdentityStored');
    GenerateNewIdentity();
}

function IsDataStored() {
    return localStorage.getItem('fakeIdentityStored') !== null;
}

function GenerateNewIdentity() {
    let completeName, firstName, lastName, gender, d, m, y, 
    birthDate, birthPlace, prov, email, piva, cf, company, address, zip;

    if (!IsDataStored()) {
        company = faker.company.companyName() + ' ' + faker.company.companySuffix();
        firstName = faker.name.firstName();
        lastName = faker.name.lastName();
        completeName = firstName + " " + lastName;
        email = faker.internet.email();

        let pastDt = faker.date.past();
        d = pastDt.getDay();
        m = pastDt.getMonth() + 1;
        y = pastDt.getFullYear();

        birthDate = new Date(y, m, d, 0, 0, 0, 0);

        birthPlace = 'Cesena';
        prov = 'FC';

        piva = pg.generate();

        try {
            cf = CodiceFiscale.compute({
                name: firstName,
                surname: lastName,
                gender: faker.random.number() % 2 === 0 ? 'M' : 'F',
                day: d,
                month: m,
                year: y,
                birthplace: birthPlace,
                birthplace_provincia: prov
            });
        } catch (ex) {
            cf = ex.message;
        }

        address = faker.address.streetName().split(' ').reverse().join(' ')+' '+faker.random.number(999);
        zip = faker.address.zipCode();

        localStorage.setItem('company', company);
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('completeName', completeName);
        localStorage.setItem('email', email);

        localStorage.setItem('d', d);
        localStorage.setItem('m', m);
        localStorage.setItem('y', y);

        localStorage.setItem('birthPlace', birthPlace);
        localStorage.setItem('prov', prov);

        localStorage.setItem('piva', piva);
        localStorage.setItem('cf', cf);

        localStorage.setItem('address', address);
        localStorage.setItem('zip', zip);

        localStorage.setItem('fakeIdentityStored', new Date().getTime());
    } else {
        company = localStorage.getItem('company');
        firstName = localStorage.getItem('firstName');
        lastName = localStorage.getItem('lastName');
        completeName = localStorage.getItem('completeName');
        email = localStorage.getItem('email');

        d = localStorage.getItem('d');
        m = localStorage.getItem('m');
        y = localStorage.getItem('y');

        birthDate = new Date(y, m, d, 0, 0, 0, 0);

        birthPlace = localStorage.getItem('birthPlace');
        prov = localStorage.getItem('prov');

        piva = localStorage.getItem('piva');
        cf = localStorage.getItem('cf');

        address = localStorage.getItem('address');
        zip = localStorage.getItem('zip');
    }

    $company.innerText = company;
    $firstName.innerText = firstName;
    $lastName.innerText = lastName;
    $completeName.innerText = completeName;
    $email.innerText = email;
    $birthDate.innerText = FormatDate(birthDate);
    $birthPlace.innerText = birthPlace;
    $prov.innerText = prov;
    $piva.innerText = piva;
    $cf.innerText = cf;
    $address.innerText = address;
    $zip.innerText = zip;
}

function FormatDate(MyDate) {
    MyDate.setDate(MyDate.getDate() + 20);

    return ('0' + MyDate.getDate()).slice(-2) + '/' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '/' + MyDate.getFullYear();
}

function Copy(event) {
    event.preventDefault();

    const inp = document.createElement('input');
    document.body.appendChild(inp)
    inp.value = event.target.innerText;
    inp.select();
    document.execCommand('copy', false);
    inp.remove();

    NotifyUser('Fake Identity Generator', 'Copied!');
}

function NotifyUser(title, msg) {
    let options = {
        type: "basic",
        title: title,
        message: msg,
        iconUrl: "icon.png"
    };

    chrome.notifications.create("FakeIdentityGeneratorNotification", options, function () {
        setTimeout(function () {
            chrome.notifications.clear("FakeIdentityGeneratorNotification");
        }, 2000);
    });
}

faker.locale = 'it';
GenerateNewIdentity();