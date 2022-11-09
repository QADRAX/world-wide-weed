import { NextApiRequest, NextApiResponse } from 'next';
import { getUserInfoFromRequest } from '../../../server/authentication';
import { GameController } from '../../../server/GameController';

export type MessageRequest = {
    text: string;
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: MessageRequest;
}

const Message = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const request = req.body;

    if (!request) {
        return res.status(400).json({ message: "Empty request" });
    }

    const player = await getUserInfoFromRequest(req);

    if (!player) {
        return res.status(401).json({ message: "You must be logged in." });
    }

    if (player.userRoles.includes('chat')) {
        const controller = new GameController(player);

        const postMessageResult = await controller.postChatMessage(request.text);

        if (postMessageResult.errors.length > 0) {
            return res.status(400).json(postMessageResult.errors);
        } else {
            return res.status(200).json(true);
        }
    } else {
        return res.status(403).json({ message: "You are banned to chat" });
    }

};

export default Message;