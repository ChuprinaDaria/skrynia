# Stripe Webhook Setup Guide

## Webhook URL

Ваш Stripe webhook endpoint:

```
https://api.runebox.eu/api/v1/payments/stripe/webhook
```

**Або для тестового середовища (якщо використовуєте):**
```
http://your-local-domain:8000/api/v1/payments/stripe/webhook
```

## Як налаштувати в Stripe Dashboard

### 1. Відкрийте Stripe Dashboard

- **Production**: https://dashboard.stripe.com/
- **Test Mode**: https://dashboard.stripe.com/test/webhooks

### 2. Перейдіть до Webhooks

1. У лівому меню натисніть **Developers** → **Webhooks**
2. Натисніть **Add endpoint** (або **+ Add endpoint**)

### 3. Налаштуйте Webhook

**Endpoint URL:**
```
https://api.runebox.eu/api/v1/payments/stripe/webhook
```

**Description (опціонально):**
```
Skrynia Payment Webhook
```

**Events to send:**
Виберіть наступні події:

**Charge Events:**
1. ✅ `charge.captured` - коли charge захоплено
2. ✅ `charge.expired` - коли charge прострочено
3. ✅ `charge.failed` - коли charge не вдався
4. ✅ `charge.pending` - коли charge в очікуванні
5. ✅ `charge.refunded` - коли зроблено рефанд
6. ✅ `charge.succeeded` - коли charge успішний
7. ✅ `charge.updated` - коли charge оновлено
8. ✅ `charge.dispute.closed` - коли dispute закрито
9. ✅ `charge.dispute.created` - коли dispute створено
10. ✅ `charge.dispute.funds_reinstated` - коли кошти повернуто після dispute
11. ✅ `charge.dispute.funds_withdrawn` - коли кошти знято через dispute
12. ✅ `charge.dispute.updated` - коли dispute оновлено
13. ✅ `charge.refund.updated` - коли refund оновлено

**Checkout Events:**
1. ✅ `checkout.session.async_payment_failed` - коли async payment не вдався
2. ✅ `checkout.session.async_payment_succeeded` - коли async payment успішний
3. ✅ `checkout.session.completed` - коли платіжна сесія завершена
4. ✅ `checkout.session.expired` - коли юзер закрив чекаут без оплати

**Або виберіть:**
- ✅ **Select events to listen to** → виберіть всі ці події

### 4. Отримайте Webhook Secret

Після створення webhook:

1. Натисніть на створений webhook endpoint
2. У розділі **Signing secret** натисніть **Reveal** (або **Click to reveal**)
3. Скопіюйте значення (починається з `whsec_...`)

**Приклад:**
```
whsec_1234567890abcdefghijklmnopqrstuvwxyz
```

### 5. Додайте Secret до змінних оточення

Додайте отриманий secret до вашого `.env` файлу:

```env
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnopqrstuvwxyz
```

**Для production:**
- Додайте до `docker-compose.prod.yml` або змінних оточення на сервері
- Перезапустіть backend контейнер

**Для development:**
- Додайте до `skrynia/backend/.env` або `docker-compose.yml`

## Перевірка роботи

### Тестовий запит

Ви можете протестувати webhook через Stripe CLI:

```bash
stripe listen --forward-to https://api.runebox.eu/api/v1/payments/stripe/webhook
```

### Перевірка в логах

Після налаштування перевірте логи backend:

```bash
docker logs skrynia_backend
```

Шукайте повідомлення про обробку webhook подій.

## Важливо

1. **HTTPS обов'язковий** для production
2. **Webhook secret** повинен бути унікальним для кожного endpoint
3. **Не діліться** webhook secret публічно
4. Для **test mode** використовуйте окремий webhook endpoint з test secret

## Події, які обробляються

### Charge Events

**1. `charge.captured`** - коли charge захоплено (для delayed payment methods)
- Оновлює `payment_status` на `COMPLETED`
- Встановлює `paid_at` якщо ще не встановлено

**2. `charge.expired`** - коли charge прострочено
- Змінює статус замовлення на `CANCELLED`
- Встановлює `payment_status` на `FAILED`

**3. `charge.failed`** - коли charge не вдався
- Встановлює `payment_status` на `FAILED`

**4. `charge.pending`** - коли charge в очікуванні
- Встановлює `payment_status` на `PENDING`

**5. `charge.refunded`** - коли зроблено рефанд
- Оновлює `payment_status` на `REFUNDED`
- Оновлює `order.status` на `REFUNDED`
- Скасовує InPost shipment (якщо ще не відправлено)

**6. `charge.succeeded`** - коли charge успішний
- Оновлює `payment_status` на `COMPLETED` (якщо не `PAID_PARTIALLY`)
- Встановлює `paid_at` якщо ще не встановлено

**7. `charge.updated`** - коли charge оновлено
- Логує оновлення (metadata, description)

**8. `charge.dispute.closed`** - коли dispute закрито
- Логує закриття dispute

**9. `charge.dispute.created`** - коли dispute створено
- Логує створення dispute (warning level)

**10. `charge.dispute.funds_reinstated`** - коли кошти повернуто
- Логує повернення коштів (info level)

**11. `charge.dispute.funds_withdrawn`** - коли кошти знято
- Логує зняття коштів (warning level)

**12. `charge.dispute.updated`** - коли dispute оновлено
- Логує оновлення dispute

**13. `charge.refund.updated`** - коли refund оновлено
- Логує оновлення refund

### Checkout Events

**1. `checkout.session.async_payment_failed`** - коли async payment не вдався
- Встановлює `payment_status` на `FAILED`

**2. `checkout.session.async_payment_succeeded`** - коли async payment успішний
- Оновлює `payment_status`:
  - `PAID_FULLY` (stage == 2)
  - `COMPLETED` (інші випадки)
- Встановлює `paid_at`

**3. `checkout.session.completed`** (Головний герой) ✅
- Оновлення статусу замовлення
- Встановлення `payment_status`:
  - `PAID_PARTIALLY` (stage == 1) - передоплата 50%
  - `PAID_FULLY` (stage == 2 або звичайна оплата 100%)
- Автоматичне створення InPost shipment для preorder товарів
- Відправка email-сповіщень

**4. `checkout.session.expired`** (Запасний гравець) ⏳
- Очищення "висячих" замовлень
- Автоматична зміна статусу на `CANCELLED` для замовлень, які не були оплачені

## Troubleshooting

### Помилка "Invalid signature"

- Перевірте, що `STRIPE_WEBHOOK_SECRET` правильний
- Переконайтеся, що використовуєте правильний secret для правильного режиму (test/production)

### Webhook не отримує події

- Перевірте, що URL доступний з інтернету
- Перевірте, що endpoint відповідає HTTP 200
- Перевірте логи Stripe Dashboard → Webhooks → Attempts

### Помилка 404

- Перевірте правильність URL
- Переконайтеся, що backend запущений
- Перевірте, що роутер правильно зареєстрований в `main.py`

