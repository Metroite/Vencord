/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { addContextMenuPatch, NavContextMenuPatchCallback, removeContextMenuPatch } from "@api/ContextMenu";
import { classNameFactory } from "@api/Styles";
import { OpenExternalIcon } from "@components/Icons";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Menu, PermissionsBits, PermissionStore, showToast, Toasts } from "@webpack/common";


const OptionClasses = findByPropsLazy("optionName", "optionIcon", "optionLabel");

export const cl = classNameFactory("vc-vmsg-");

export default definePlugin({
    name: "PiPiConnect",
    description: "This plugin connects you with your peers over a privacy friendly and more performant P2P (Peer-to-Peer) connection.",
    authors: [Devs.metroite],

    start(): void {
        addContextMenuPatch("channel-attach", ctxMenuPatch);
    },

    stop(): void {
        removeContextMenuPatch("channel-attach", ctxMenuPatch);
    }
});

const ctxMenuPatch: NavContextMenuPatchCallback = (children, props) => () => {
    if (props.channel.guild_id && !(PermissionStore.can(PermissionsBits.SEND_VOICE_MESSAGES, props.channel) && PermissionStore.can(PermissionsBits.SEND_MESSAGES, props.channel))) return;

    children.push(
        <Menu.MenuItem
            id="pp-send-offer"
            label={
                <div className={OptionClasses.optionLabel}>
                    <OpenExternalIcon className={OptionClasses.optionIcon} height={24} width={24} />
                    <div className={OptionClasses.optionName}>Send offer</div>
                </div>
            }
            action={() => showToast("Now sending offer... Please be patient", Toasts.Type.MESSAGE)}
        />
    );
};

