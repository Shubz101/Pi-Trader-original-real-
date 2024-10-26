import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
rst()
        
        if (!user) {
            return NextResponse.json({ error: 'No user found' }, { status: 404 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                paymentMethod,
                paymentAddress
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
