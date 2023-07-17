// Ланцюжок відповідальності (Chain of Responsibility) — це паттерн програмування, який дозволяє передавати запити послідовно через ланцюжок обробників, кожен з яких може обробити або передати запит далі.

// AuthProcessor клас для обробки аутентифікації.
class AuthProcessor {
  constructor() {
    this.nextProcessor = null; // Наступний обробник в ланцюзі
  }

  // Метод для встановлення наступного обробника в ланцюзі
  setNextProcessor(processor) {
    this.nextProcessor = processor;
    return processor;
  }

  // Метод для перевірки аутентифікації. Приймає ім'я користувача (username) і пароль (passkey).
  validate(username, passkey) {
    // Перевіряє, чи є наступний обробник в ланцюгу.
    if (this.nextProcessor) {
      // Якщо є наступний обробник, передаємо йому запит на перевірку аутентифікації
      return this.nextProcessor.validate(username, passkey);
    }

    // Якщо немає наступного обробника, повертаємо false, сигналізуючи про невдалу аутентифікацію.
    return false;
  }
}

// TwoStepProcessor Клас обробника, який перевіряє двофакторний код. Наслідує базовий клас AuthProcessor.
class TwoStepProcessor extends AuthProcessor {
  // Метод для перевірки аутентифікації validate. Перевіряє ім'я користувача (username), пароль (passkey) і викликаємо метод isValidTwoStepCode().
  // Якщо username дорівнює "john", passkey дорівнює "password" та метод isValidTwoStepCode() повертає true, аутентифікація успішна.
  // Виводить повідомлення про успішну аутентифікацію: Вхід дозволено з двофакторною аутентифікацією, і повертає true.
  validate(username, passkey) {
    if (username === "john" && passkey === "password" && this.isValidTwoStepCode()) {
      console.log("Вхід дозволено з двофакторною аутентифікацією");
      return true;
    } else {
      // Якщо дані не вірні, передаємо запит на аутентифікацію наступному обробнику
      return super.validate(username, passkey);
    }
  }

  // Метод для перевірки двофакторного коду, який повертає true.
  isValidTwoStepCode() {
    // Логіка перевірки двофакторного коду
    // Повертає true, якщо код вірний
    return true;
  }
}

// RoleProcessor Клас обробника, який перевіряє ролі користувача. Наслідує базовий клас AuthProcessor.
class RoleProcessor extends AuthProcessor {
  // Метод для перевірки аутентифікації. Перевіряє роль користувача.
  // Якщо роль користувача - гість (guest), аутентифікація успішна.
  // Виводить повідомлення про успішну аутентифікацію: Вхід дозволено з роллю гостя, і повертає true.
  validate(username, passkey) {
    if (username === "guest") {
      console.log("Вхід дозволено з роллю гостя");
      return true;
    } else {
      // Якщо роль не відповідає, передаємо запит на аутентифікацію наступному обробнику
      return super.validate(username, passkey);
    }
  }
}

// CredentialsProcessor Клас обробника, який перевіряє облікові дані користувача. Наслідує базовий клас AuthProcessor.
class CredentialsProcessor extends AuthProcessor {
  // Метод для перевірки аутентифікації. Перевіряє облікові дані користувача.
  // Якщо облікові дані вірні, username=admin, та passkey=admin123, аутентифікація успішна.
  // Виводить повідомлення про успішну аутентифікацію: Вхід дозволено за обліковими даними, і повертає true.
  validate(username, passkey) {
    if (username === "admin" && passkey === "admin123") {
      console.log("Вхід дозволено за обліковими даними");
      return true;
    } else {
      // Якщо облікові дані не вірні, передаємо запит на аутентифікацію наступному обробнику
      return super.validate(username, passkey);
    }
  }
}

// Клас Builder для створення об'єкта ланцюга обробників.
class ProcessorBuilder {
  constructor() {
    this.firstProcessor = null; // Перший обробник в ланцюгу
    this.lastProcessor = null; // Останній обробник в ланцюгу
  }

  // Метод add для додавання нового обробника в ланцюг.
  add(processor) {
    if (this.firstProcessor === null) {
      // Якщо це перший обробник, встановлюємо його як перший і останній
      this.firstProcessor = processor;
      this.lastProcessor = processor;
    } else {
      // Якщо це не перший обробник, додаємо його в кінець ланцюгу
      this.lastProcessor.setNextProcessor(processor);
      this.lastProcessor = processor;
    }

    // Повертає this для підтримки ланцюжкового виклику
    return this;
  }

  // Метод create для створення ланцюга обробників.
  // Повертає перший обробник у ланцюгу.
  create() {
    return this.firstProcessor;
  }
}

// Клас FinalProcessor для обробки в кінці ланцюга, коли жоден обробник не відповідає.
class FinalProcessor extends AuthProcessor {
  validate(username, passkey) {
    console.log("Вхід заборонено");
    return false;
  }
}

console.log("Завдання 6 ====================================");

// Створюємо Builder для ланцюга обробників.
const processorBuilder = new ProcessorBuilder();

// Додаємо обробники в ланцюг за допомогою builder'а.
const processor = processorBuilder
  .add(new CredentialsProcessor())
  .add(new TwoStepProcessor())
  .add(new RoleProcessor())
  .add(new FinalProcessor()) // Додаємо останній обробник в ланцюг
  .create();

// Перевіряємо користувачів за допомогою нашого ланцюга обробників.
processor.validate("admin", "admin123"); // Вхід дозволено за обліковими даними
processor.validate("john", "password"); // Вхід дозволено з двофакторною аутентифікацією
processor.validate("guest", "guest123"); // Вхід дозволено з роллю гостя
processor.validate("user", "password"); // Вхід заборонено
