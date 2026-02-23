'use client'

async function handleCheckout(cartItems: { _id: string }[]) {
    const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            items: cartItems.map((i) => ({ productId: i._id, qty: 1 })),
        }),
    })

    const data = await res.json()
    if (data.url) window.location.href = data.url
}
